from rest_framework import serializers
from .models import (
    User,
    ContactMessage,
    News,
    NewsletterSubscription,
    UserSession,
    Crop,
    Tip,
    Tool,
    CropRecommendation,
    FarmingActivity,
    UserActivityLog,
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'


class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscription
        fields = '__all__'


class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'


class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = '__all__'


class ToolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tool
        fields = "__all__"


class TipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tip
        fields = "__all__"


class CropRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropRecommendation
        fields = "__all__"


class FarmingActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmingActivity
        fields = "__all__"


class UserActivityLogSerializer(serializers.ModelSerializer):
    activity = FarmingActivitySerializer()

    class Meta:
        model = UserActivityLog
        fields = ('id', 'activity', 'completion_date', 'notes', 'image', 'is_completed', 'status')


class UserSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSession
        fields = ('id', 'user', 'started_at', 'ended_at')
        read_only_fields = ('user',)
