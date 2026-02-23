from rest_framework import serializers
from .models import UserMe, Institution, Queue, Token


class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMe
        fields = ['id', 'name', 'email', 'reward_points']


class QueueSerializer(serializers.ModelSerializer):
    active_tokens = serializers.SerializerMethodField()

    class Meta:
        model = Queue
        fields = ['id', 'name', 'size', 'service_time_minutes', 'is_paused', 'is_closed', 'active_tokens']

    def get_active_tokens(self, obj):
        return obj.tokens.filter(status__in=['WAITING', 'CALLING']).count()


class InstitutionSerializer(serializers.ModelSerializer):
    queues = QueueSerializer(many=True, read_only=True)
    class Meta:
        model = Institution
        fields = ['id', 'name', 'email', 'phone', 'address', 'queues']


class TokenSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.name')
    class Meta:
        model = Token
        fields = ['id', 'user', 'user_name', 'queue', 'token_number', 'status', 'joined_at']
