from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from src.lib.django.views_mixin import ViewSetHelperMixin

from .models import BigLog, LogDBEntry
from .serializers import BigLogSerializer, LogDBEntrySerializer, UploadSerializer


# ViewSets define the view behavior.
class UploadViewSet(
    ViewSetHelperMixin, mixins.CreateModelMixin, viewsets.GenericViewSet
):
    serializers = {
        "default": UploadSerializer,
    }
    permissions = {
        "default": [IsAuthenticated],
    }  # Only authenticated users can access

    def create(self, request):
        file_uploaded = request.FILES.get("file_uploaded", None)
        content_type = file_uploaded
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"error": "codebase was not specified"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if file_uploaded:
            self.handle_uploaded_file(file_uploaded, serializer)

        response = "POST API and you have uploaded a {} file".format(content_type)
        return Response(response)

    def handle_uploaded_file(self, file, serializer):
        pass


class LogDBEntryViewSet(
    ViewSetHelperMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    serializers = {
        "default": LogDBEntrySerializer,
    }
    permissions = {
        "default": [IsAuthenticated],
    }
    queryset = LogDBEntry.objects.all()

    @action(methods=["get"], detail=False)
    def only_this_user(self, request):
        user = self.request.user
        logs = self.queryset.filter(user=user)

        return Response(self.get_serializer(logs, many=True).data)


class BigLogViewSet(ViewSetHelperMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    serializers = {
        "default": BigLogSerializer,
    }
    permissions = {
        "default": [IsAuthenticated],
    }
    queryset = BigLog.objects.all()

    @action(methods=["get"], detail=False)
    def only_this_user(self, request):
        user = self.request.user
        logs = self.queryset.filter(user=user)

        return Response(self.get_serializer(logs, many=True).data)


class HealthCheckViewSet(ViewSetHelperMixin, viewsets.ViewSet):
    permissions = {
        "default": [AllowAny],
    }

    @action(methods=["get"], detail=False)
    def health(self, request):
        """Health check endpoint. Returns service status."""
        return Response({"status": "ok"}, status=status.HTTP_200_OK)


class DummyViewSet(ViewSetHelperMixin, ViewSet):
    permissions = {
        "default": [AllowAny],
    }

    @action(methods=["get"], detail=False)
    def dummy(self, request):
        return Response(
            {"message": "This is a dummy endpoint"}, status=status.HTTP_200_OK
        )
