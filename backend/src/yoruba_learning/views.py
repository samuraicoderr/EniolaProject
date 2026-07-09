import os
import logging
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from django.contrib.auth import get_user_model
from django.utils import timezone

from src.yoruba_learning.models import Vocabulary, UserProgress, AdminConfig, ChatMessage
from src.yoruba_learning.serializers import (
    VocabularySerializer,
    UserProgressSerializer,
    AdminConfigSerializer,
    ChatMessageSerializer,
)

User = get_user_model()
logger = logging.getLogger(__name__)


class VocabularyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows vocabularies to be viewed.
    """
    queryset = Vocabulary.objects.all()
    serializer_class = VocabularySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class ProgressViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows user progress to be viewed or updated.
    """
    serializer_class = UserProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProgress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def update_progress(self, request):
        """
        Custom action to update or create progress.
        Expects: { "category": "animals", "stars": 8, "completed": true }
        """
        category = request.data.get('category')
        stars = request.data.get('stars', 0)
        completed = request.data.get('completed', False)

        if not category:
            return Response({"error": "Category is required"}, status=status.HTTP_400_BAD_REQUEST)

        progress, created = UserProgress.objects.update_or_create(
            user=request.user,
            category=category,
            defaults={
                'stars': stars,
                'completed': completed,
                'last_played': timezone.now()
            }
        )

        return Response(UserProgressSerializer(progress).data)


class LeaderboardView(APIView):
    """
    API endpoint to fetch leaderboards.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Sum stars for each user
        leaders = User.objects.annotate(
            total_stars=Sum('yoruba_progress__stars')
        ).filter(total_stars__gt=0).order_by('-total_stars')[:20]

        data = []
        for leader in leaders:
            data.append({
                "username": leader.username,
                "first_name": leader.first_name,
                "last_name": leader.last_name,
                "stars": leader.total_stars,
                "is_self": leader == request.user
            })

        # If requesting user has 0 stars, they might not be in the list, so append them at the bottom
        user_stars = UserProgress.objects.filter(user=request.user).aggregate(total=Sum('stars'))['total'] or 0
        user_in_list = any(l["username"] == request.user.username for l in data)
        if not user_in_list:
            data.append({
                "username": request.user.username,
                "first_name": request.user.first_name,
                "last_name": request.user.last_name,
                "stars": user_stars,
                "is_self": True
            })

        # Sort the final list by stars descending
        data = sorted(data, key=lambda x: x["stars"], reverse=True)

        # Add rank
        for i, item in enumerate(data):
            item["rank"] = i + 1

        return Response(data)


class AdminConfigView(APIView):
    """
    API endpoint for admin settings. Restricted to superusers.
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        config, _ = AdminConfig.objects.get_or_create(pk='00000000-0000-0000-0000-000000000001')
        serializer = AdminConfigSerializer(config)
        return Response(serializer.data)

    def put(self, request):
        config, _ = AdminConfig.objects.get_or_create(pk='00000000-0000-0000-0000-000000000001')
        serializer = AdminConfigSerializer(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StatsView(APIView):
    """
    API endpoint for administrative usage metrics. Restricted to superusers.
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # Signup rates by day (last 14 days)
        signups = User.objects.annotate(
            date=TruncDate('date_joined')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')[-14:]

        signup_data = [{"date": str(s['date']), "signups": s['count']} for s in signups]

        # Total analytics metrics
        total_users = User.objects.count()
        total_stars = UserProgress.objects.aggregate(total=Sum('stars'))['total'] or 0
        total_completed = UserProgress.objects.filter(completed=True).count()
        total_chat_messages = ChatMessage.objects.count()

        # Chat message history grouped by day (for billing charts)
        messages_by_day = ChatMessage.objects.annotate(
            date=TruncDate('timestamp')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')[-14:]

        # Estimate billing:
        # LLM inference estimation: $0.002 per msg
        # Fal.ai Voice synthesis: $0.015 per msg
        billing_data = []
        for m in messages_by_day:
            day_str = str(m['date'])
            msg_count = m['count']
            billing_data.append({
                "date": day_str,
                "llm_cost": round(msg_count * 0.002, 4),
                "voice_cost": round(msg_count * 0.015, 4),
                "total_cost": round(msg_count * 0.017, 4),
            })

        return Response({
            "totals": {
                "users": total_users,
                "stars": total_stars,
                "lessons_completed": total_completed,
                "chat_sessions": total_chat_messages
            },
            "signups": signup_data,
            "billing": billing_data
        })


class YorubaCoachView(APIView):
    """
    Endpoint for conversing with Eniola, the Yoruba learning coach.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Fetch status if keys are configured, and return last 20 chat messages
        config, _ = AdminConfig.objects.get_or_create(pk='00000000-0000-0000-0000-000000000001')
        active = bool(config.fal_api_key and config.llm_api_key)
        
        messages = ChatMessage.objects.filter(user=request.user).order_by('timestamp')[:30]
        serializer = ChatMessageSerializer(messages, many=True)
        
        return Response({
            "active": active,
            "messages": serializer.data
        })

    def post(self, request):
        user_text = request.data.get('text', '').strip()
        if not user_text:
            return Response({"error": "Text is required"}, status=status.HTTP_400_BAD_REQUEST)

        config, _ = AdminConfig.objects.get_or_create(pk='00000000-0000-0000-0000-000000000001')
        if not config.fal_api_key or not config.llm_api_key:
            return Response({
                "error": "Yoruba Coach is currently offline. Please configure API keys in the admin settings."
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # 1. Save user message to database
        ChatMessage.objects.create(user=request.user, role='user', text=user_text)

        # 2. Get past chat history for context
        history = ChatMessage.objects.filter(user=request.user).order_by('timestamp')[-8:]
        messages_context = []
        for msg in history:
            role_name = "Human" if msg.role == 'user' else "AI"
            messages_context.append(f"{role_name}: {msg.text}")
        chat_history_str = "\n".join(messages_context)

        # 3. Call LLM using LangChain
        system_prompt = (
            "You are Eniola, a friendly and energetic Yoruba language coach for kids. "
            "Speak in simple, engaging English, but teach Yoruba terms, explain their pronunciations, "
            "and offer encouragement using simple Yoruba words like 'Káàbọ̀' (Welcome), 'Oṣé' (Well done), etc. "
            "Keep responses short and conversational (1-2 sentences), suitable for a child aged 3 to 7. "
            "Always include some Yoruba words with their English meanings in parentheses."
        )

        response_text = ""
        try:
            if config.llm_provider == 'groq':
                from langchain_groq import ChatGroq
                llm = ChatGroq(api_key=config.llm_api_key, model=config.llm_model)
            elif config.llm_provider == 'openai':
                from langchain_openai import ChatOpenAI
                llm = ChatOpenAI(api_key=config.llm_api_key, model=config.llm_model)
            elif config.llm_provider == 'gemini':
                from langchain_google_genai import ChatGoogleGenerativeAI
                llm = ChatGoogleGenerativeAI(google_api_key=config.llm_api_key, model=config.llm_model)
            elif config.llm_provider == 'anthropic':
                from langchain_anthropic import ChatAnthropic
                llm = ChatAnthropic(api_key=config.llm_api_key, model=config.llm_model)
            else:
                raise ValueError(f"Unknown provider {config.llm_provider}")

            # Assemble call
            from langchain_core.messages import SystemMessage, HumanMessage
            llm_messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=f"Here is the history of our chat:\n{chat_history_str}\n\nHuman: {user_text}")
            ]
            response = llm.invoke(llm_messages)
            response_text = response.content
        except Exception as e:
            logger.error(f"Error calling LLM: {str(e)}")
            response_text = "Oṣé! I am happy to learn with you, but my system is experiencing some technical connection issues right now. Let's try again in a bit!"

        # 4. Generate audio via Fal.ai Chatterbox TTS
        audio_url = None
        if response_text:
            try:
                # Remove emotive paralinguistic marks like [sigh] or emojis for TTS stability
                tts_text = response_text
                # Set environment key for fal client
                os.environ["FAL_KEY"] = config.fal_api_key
                import fal_client

                # Call chatterbox text-to-speech model
                result = fal_client.subscribe(
                    "fal-ai/chatterbox/text-to-speech",
                    arguments={
                        "text": tts_text,
                        "temperature": 0.6,
                        "exaggeration": 0.35,
                    }
                )
                if "audio" in result and "url" in result["audio"]:
                    audio_url = result["audio"]["url"]
            except Exception as e:
                logger.error(f"Error calling Fal.ai Chatterbox API: {str(e)}")
                # Fail gracefully: return text reply even if voice generation fails

        # 5. Save coach response to database
        coach_msg = ChatMessage.objects.create(
            user=request.user,
            role='assistant',
            text=response_text,
            audio_url=audio_url
        )

        return Response(ChatMessageSerializer(coach_msg).data)
