#!/usr/bin/env python3

import argparse
import subprocess
import sys
from pathlib import Path


def run_git_command(args, repo_path):
    """Run a git command and return stdout, or exit on failure."""
    try:
        result = subprocess.run(
            ["git", "-C", str(repo_path)] + args,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            encoding="utf-8",
            errors="replace",
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Git command failed: {' '.join(e.cmd)}", file=sys.stderr)
        print(e.stderr, file=sys.stderr)
        sys.exit(1)


def resolve_branch(repo_path, branch):
    """Return the resolved branch or HEAD if not provided."""
    if branch:
        return branch
    return "HEAD"


def get_commit_list(repo_path, branch, commit_range):
    """
    Return list of commit hashes in chronological order.
    Handles:
      - No range: full branch history
      - Range: A..B, A...B, single commit, etc.
    """
    if commit_range:
        rev_spec = commit_range
    else:
        # Entire history of branch
        rev_spec = branch

    output = run_git_command(
        ["rev-list", "--reverse", rev_spec],
        repo_path,
    )

    commits = output.splitlines()

    if not commits:
        print("No commits found for the specified branch/range.", file=sys.stderr)
        sys.exit(1)

    return commits


def write_diffs(commits, output_dir, repo_path):
    """Write each commit's diff to a separate file."""
    for index, commit in enumerate(commits, start=1):
        short_hash = commit[:7]
        filename = f"{index:04d}_{short_hash}.diff"
        output_path = output_dir / filename

        diff = run_git_command(
            ["show", commit, "--pretty=format:", "--patch"],
            repo_path,
        )

        output_path.write_text(diff, encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(
        description="Generate a folder containing one diff file per commit."
    )

    parser.add_argument(
        "output_folder",
        help="Directory where diff files will be written.",
    )

    parser.add_argument(
        "--repo",
        default=".",
        help="Path to the git repository (default: current directory).",
    )

    parser.add_argument(
        "--branch",
        help="Branch to use (default: current branch).",
    )

    parser.add_argument(
        "--range",
        dest="commit_range",
        help="Commit range (e.g. A..B, A...B, single commit). Default: entire branch history.",
    )

    args = parser.parse_args()

    repo_path = Path(args.repo).resolve()
    output_dir = Path(args.output_folder).resolve()

    if not repo_path.exists():
        print(f"Repository path does not exist: {repo_path}", file=sys.stderr)
        sys.exit(1)

    # Verify git repo
    run_git_command(["rev-parse", "--is-inside-work-tree"], repo_path)

    branch = resolve_branch(repo_path, args.branch)

    # Verify branch exists (if provided)
    if args.branch:
        run_git_command(["rev-parse", "--verify", branch], repo_path)

    output_dir.mkdir(parents=True, exist_ok=True)

    commits = get_commit_list(repo_path, branch, args.commit_range)

    write_diffs(commits, output_dir, repo_path)

    print(f"Generated {len(commits)} diff files in: {output_dir}")


if __name__ == "__main__":
    main()