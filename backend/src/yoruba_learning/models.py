import uuid
from django.db import models
from django.contrib.auth import get_user_model
from src.lib.utils.uuid7 import uuid7

User = get_user_model()


class Vocabulary(models.Model):
    CATEGORY_CHOICES = [
        ('animals', 'Animals'),
        ('colors', 'Colors'),
        ('numbers', 'Numbers'),
        ('objects', 'Objects'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid7, editable=False)
    english = models.CharField(max_length=255)
    yoruba = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    emoji = models.CharField(max_length=50)
    audio_url = models.URLField(blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "vocabularies"
        ordering = ['date_created']

    def __str__(self):
        return f"{self.english} -> {self.yoruba} ({self.category})"


class UserProgress(models.Model):
    CATEGORY_CHOICES = [
        ('animals', 'Animals'),
        ('colors', 'Colors'),
        ('numbers', 'Numbers'),
        ('objects', 'Objects'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid7, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='yoruba_progress')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    stars = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    last_played = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'category')
        ordering = ['category']

    def __str__(self):
        return f"{self.user.username} - {self.category}: {self.stars} stars"


class AdminConfig(models.Model):
    from src.lib.clients.yarngpt import VOICES
    PROVIDER_CHOICES = [
        ('groq', 'Groq'),
        ('openai', 'OpenAI'),
        ('gemini', 'Google Gemini'),
        ('anthropic', 'Anthropic Claude'),
    ]

    YARN_GPT_VOICE_CHOICES = [(v, v) for v in VOICES]

    id = models.UUIDField(primary_key=True, default=uuid7, editable=False)
    fal_api_key = models.CharField(max_length=500, blank=True, default='')
    llm_provider = models.CharField(max_length=50, choices=PROVIDER_CHOICES, default='groq')
    llm_api_key = models.CharField(max_length=500, blank=True, default='')
    llm_model = models.CharField(max_length=100, default='llama-3.1-8b-instant')
    yarn_gpt_api_key = models.CharField(max_length=500, blank=True, default='')
    yarn_gpt_voice = models.CharField(max_length=50, choices=YARN_GPT_VOICE_CHOICES, default='Idera')
    date_updated = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Enforce singleton pattern
        self.id = uuid.UUID('00000000-0000-0000-0000-000000000001')
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Admin Config (Last updated: {self.date_updated})"


class ChatMessage(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid7, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='yoruba_chat_messages')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    text = models.TextField()
    audio_url = models.URLField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.user.username} ({self.role}): {self.text[:30]}"
