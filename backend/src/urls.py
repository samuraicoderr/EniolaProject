from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.urls import include, path, re_path, reverse_lazy
from django.views.generic.base import RedirectView
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from .lib.django.superlazyroutertools import super_lazy_path

# ==================================================================================================
# Shared routers — always mounted
# ==================================================================================================


urlpatterns = []
shared_routers = []

from src.common.urls import common_router
from src.files.urls import files_router
from src.notifications.urls import notification_router
from src.reset_password.routes import password_reset_router
from src.users.auth import RefreshTokenView
from src.users.urls import (
    auth_router,
    oauth_router,
    users_router,
)

shared_routers.extend(
    [
        [users_router, "user"],
        [auth_router, "auth"],
        [oauth_router, "oauth"],
        # [files_router, "files"],
        [notification_router, "notifications"],
        # [common_router, "common"],
        [password_reset_router, "password_reset", "password_reset"],
    ]
)

django_urls = [
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path(
        "api/v1/auth/login/refresh_token/",
        RefreshTokenView.as_view(),
        name="token_refresh",
    ),
]
urlpatterns += django_urls


def health(request):
    return JsonResponse({"status": "ok", "message": "We cool homie"})


swagger_urls = [
    # OpenAPI schema endpoint
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    # Swagger UI
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    # Redoc UI (optional)
    path("api/redocs/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    path("health/", health, name="health"),
    # the 'api-root' from django rest-frameworks default router
    re_path(r"^$", RedirectView.as_view(url=reverse_lazy("api-root"), permanent=False)),
]


urlpatterns += [
    *super_lazy_path("api/v1/", shared_routers, use_tag_as_default_namespace=False),
]
urlpatterns += swagger_urls
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
