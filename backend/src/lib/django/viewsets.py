"""
Shared viewset base used by both API surfaces (`developer_api` and
`developer_dashboard`).

Both surfaces need a ModelViewSet that:

- delegates create/update/delete to a domain ``service_class`` instead of
  touching the model directly (business logic stays in services),
- exposes the active organization to serializers via ``serializer_context``,
- returns the serialized representation after create/update.

Surfaces only differ in their ``permission_classes`` and how the active
organization is resolved, so those remain the surface's responsibility.
"""

from __future__ import annotations

from rest_framework import status, viewsets
from rest_framework.response import Response

from src.lib.django.views_mixin import ViewSetHelperMixin


class ServiceBackedModelViewSet(ViewSetHelperMixin, viewsets.ModelViewSet):
    """ModelViewSet that routes mutations through a domain service."""

    service_class = None

    def get_service(self):
        if self.service_class is None:
            return None
        return self.service_class(
            organization=self.request.organization,
            actor=self._actor(),
        )

    def _actor(self):
        """Return the actor for service audit logging. Overridable per surface.

        Returns None when the request has no authenticated user (e.g. API-key
        auth on the developer_api surface), so that audit logs written via
        that surface store a null actor rather than failing on AnonymousUser.
        """
        user = getattr(self.request, "user", None)
        if user is not None and not user.is_authenticated:
            return None
        return user

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["organization"] = getattr(self.request, "organization", None)
        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = self.get_service()
        instance = service.create(**serializer.validated_data)
        output = self.get_serializer(instance)
        return Response(output.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        service = self.get_service()
        instance = service.update(instance, **serializer.validated_data)
        output = self.get_serializer(instance)
        return Response(output.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        service = self.get_service()
        if service and hasattr(service, "delete"):
            service.delete(instance)
        else:
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
