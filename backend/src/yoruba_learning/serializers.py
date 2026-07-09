from rest_framework import serializers
from src.yoruba_learning.models import Vocabulary, UserProgress, AdminConfig, ChatMessage


class VocabularySerializer(serializers.ModelSerializer):
    class Meta:
        model = Vocabulary
        fields = ['id', 'english', 'yoruba', 'category', 'emoji', 'audio_url']


class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ['id', 'category', 'stars', 'completed', 'last_played']
        read_only_fields = ['id', 'last_played']


class AdminConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminConfig
        fields = ['fal_api_key', 'llm_provider', 'llm_api_key', 'llm_model']
        extra_kwargs = {
            # Return masked keys on read for security
            'fal_api_key': {'write_only': False},
            'llm_api_key': {'write_only': False},
        }

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Mask keys to not leak them
        if ret.get('fal_api_key'):
            ret['fal_api_key'] = ret['fal_api_key'][:6] + "..." + ret['fal_api_key'][-4:] if len(ret['fal_api_key']) > 10 else "******"
        if ret.get('llm_api_key'):
            ret['llm_api_key'] = ret['llm_api_key'][:6] + "..." + ret['llm_api_key'][-4:] if len(ret['llm_api_key']) > 10 else "******"
        return ret

    def update(self, instance, validated_data):
        # If masked keys are sent, ignore them (don't overwrite with '***')
        for key in ['fal_api_key', 'llm_api_key']:
            if key in validated_data and ('...' in validated_data[key] or validated_data[key] == '******'):
                validated_data.pop(key)
        return super().update(instance, validated_data)


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'role', 'text', 'audio_url', 'timestamp']
        read_only_fields = ['id', 'audio_url', 'timestamp']
