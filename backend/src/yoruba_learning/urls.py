from django.urls import path, include
from rest_framework.routers import DefaultRouter

from src.yoruba_learning.views import (
    VocabularyViewSet,
    ProgressViewSet,
    LeaderboardView,
    AdminConfigView,
    StatsView,
    YorubaCoachView,
)

router = DefaultRouter()
router.register(r'vocabulary', VocabularyViewSet, basename='vocabulary')
router.register(r'progress', ProgressViewSet, basename='progress')

urlpatterns = [
    path('', include(router.urls)),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('admin/settings/', AdminConfigView.as_view(), name='admin-settings'),
    path('admin/stats/', StatsView.as_view(), name='admin-stats'),
    path('coach/chat/', YorubaCoachView.as_view(), name='coach-chat'),
]
