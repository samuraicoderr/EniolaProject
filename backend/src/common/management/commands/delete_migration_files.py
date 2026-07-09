import os
from pathlib import Path
from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from django.apps import apps
from django.conf import settings


class Command(BaseCommand):
    help = "Interactively delete migration files for Django apps (except __init__.py)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--yes",
            action="store_true",
            default=False,
            help="Delete all without prompting.",
        )
        parser.add_argument(
            "--makemigrations",
            action="store_true",
            default=False,
            help="Run makemigrations after deletion.",
        )

    # -----------------------------------------------------
    # Helpers
    # -----------------------------------------------------

    def _resolve_app(self, name):
        """
        Resolve either:
        - dotted path (src.users)
        - app label (users)
        """
        try:
            return apps.get_app_config(name)
        except LookupError:
            pass

        for config in apps.get_app_configs():
            if config.name == name:
                return config

        label = name.rsplit(".", 1)[-1]
        try:
            return apps.get_app_config(label)
        except LookupError:
            raise CommandError(f"App '{name}' not found in INSTALLED_APPS.")

    # -----------------------------------------------------
    # Main
    # -----------------------------------------------------

    def handle(self, *args, **options):
        auto_confirm = options["yes"]
        auto_makemigrations = options["makemigrations"]

        # Use MY_APPS from settings
        app_names = getattr(settings, "MY_APPS", None)
        if not app_names:
            raise CommandError("settings.MY_APPS is empty or not defined.")

        files_by_app = {}

        # -----------------------------------------------------
        # Collect migrations
        # -----------------------------------------------------

        for name in app_names:
            config = self._resolve_app(name)
            migrations_dir = Path(config.path) / "migrations"

            if not migrations_dir.exists():
                continue

            files = [
                f
                for f in sorted(migrations_dir.iterdir())
                if f.is_file() and f.name != "__init__.py" and f.suffix == ".py"
            ]

            if files:
                files_by_app[config.name] = files

        if not files_by_app:
            self.stdout.write("No migration files found.")
            return

        total = sum(len(v) for v in files_by_app.values())

        self.stdout.write("")
        self.stdout.write(
            f"  Found {total} migration file(s) across {len(files_by_app)} app(s):"
        )
        self.stdout.write("")

        for app_name, files in files_by_app.items():
            self.stdout.write(self.style.WARNING(f"  📦 {app_name}"))
            for f in files:
                self.stdout.write(self.style.WARNING(f"     ⚠️  {f.name}"))
            self.stdout.write("")

        selected_apps = files_by_app

        # -----------------------------------------------------
        # INTERACTIVE PROMPT
        # -----------------------------------------------------

        if not auto_confirm:
            app_list = ", ".join(files_by_app.keys())
            self.stdout.write(f"  Apps affected: {app_list}")
            self.stdout.write("")

            user_input = input(
                "  Type 'y' to delete ALL,\n"
                "  or type ONE app name (e.g. src.users),\n"
                "  or press Enter to abort:\n"
                "  > "
            ).strip()

            # ✅ Abort
            if not user_input:
                self.stdout.write("\n  Aborted.")
                return

            # ✅ Delete all
            if user_input.lower() == "y":
                selected_apps = files_by_app

            # ✅ Delete one app
            else:
                try:
                    config = self._resolve_app(user_input)
                except CommandError as e:
                    self.stdout.write(f"\n  {e}")
                    self.stdout.write("  Aborted.")
                    return

                resolved_name = config.name

                if resolved_name not in files_by_app:
                    self.stdout.write(
                        f"\n  App '{resolved_name}' has no migrations to delete."
                    )
                    self.stdout.write("  Aborted.")
                    return

                selected_apps = {resolved_name: files_by_app[resolved_name]}

                self.stdout.write("")
                self.stdout.write(
                    self.style.WARNING(
                        f"  You are deleting migrations ONLY for: {resolved_name}"
                    )
                )
                self.stdout.write("")

                for f in selected_apps[resolved_name]:
                    self.stdout.write(self.style.WARNING(f"     ⚠️  {f.name}"))

                self.stdout.write("")
                confirm = input(
                    f"  Confirm delete for {resolved_name}? [y/N]: "
                ).strip()

                if confirm.lower() != "y":
                    self.stdout.write("\n  Aborted.")
                    return

            self.stdout.write("")

        # -----------------------------------------------------
        # DELETE FILES
        # -----------------------------------------------------

        total = sum(len(v) for v in selected_apps.values())

        for app_name, files in selected_apps.items():
            for f in files:
                os.remove(f)
                self.stdout.write(self.style.ERROR(f"  ❌ Deleted: {f}"))

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(f"  ✅ Deleted {total} migration file(s).")
        )
        self.stdout.write("")

        # -----------------------------------------------------
        # OPTIONAL MAKEMIGRATIONS
        # -----------------------------------------------------

        run_migrations = auto_makemigrations

        if not auto_makemigrations and not auto_confirm:
            confirm = input("  Run makemigrations now? [y/N]: ").strip()
            run_migrations = confirm.lower() == "y"
            self.stdout.write("")

        if run_migrations:
            labels = [apps.get_app_config(a.split(".")[-1]).label for a in selected_apps]

            self.stdout.write(
                f"  🔄 Running makemigrations for: {', '.join(labels)}"
            )
            self.stdout.write("")

            call_command(
                "makemigrations",
                *labels,
                stdout=self.stdout,
                stderr=self.stderr,
            )

            self.stdout.write("")
            self.stdout.write(self.style.SUCCESS("  ✅ makemigrations complete."))
            self.stdout.write("")