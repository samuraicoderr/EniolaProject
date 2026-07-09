"""
Shared serializer base classes used by both API surfaces
(`developer_api` and `developer_dashboard`).

These classes implement presentation concerns that are identical across
surfaces — `object` field derivation and organization-scoped related field
filtering. Concrete serializer subclasses live in each surface's own
`serializers.py` so the two surfaces can diverge over time without coupling.
"""

from __future__ import annotations

import re

from rest_framework import serializers


def _scope_queryset(queryset, organization):
    """Restrict a related-field queryset to a single organization."""
    if organization is None:
        return queryset
    return queryset.filter(organization=organization)


class ObjectSerializer(serializers.ModelSerializer):
    """Adds an `object` field whose value is the snake-cased model name."""

    object = serializers.SerializerMethodField()

    def get_object(self, obj):
        name = obj.__class__.__name__
        return re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()


class OrganizationScopedSerializer(ObjectSerializer):
    """
    Serializer base for models that belong to an organization.

    `scoped_related_fields` declares related-model fields whose writable
    choices must be restricted to the active organization. The organization is
    read from the serializer context (set by the viewset).
    """

    scoped_related_fields: tuple[tuple[str, type], ...] = ()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        organization = self.context.get("organization")
        for field_name, model in self.scoped_related_fields:
            field = self.fields.get(field_name)
            if field is not None and hasattr(field, "queryset"):
                field.queryset = _scope_queryset(model.objects.all(), organization)
