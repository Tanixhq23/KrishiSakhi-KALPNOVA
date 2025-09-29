from django.utils import timezone
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    ContactMessageSerializer,
    NewsletterSubscriptionSerializer,
    NewsSerializer,
    UserSessionSerializer,
    CropSerializer,
    ToolSerializer,
    TipSerializer,
    CropRecommendationSerializer,
    FarmingActivitySerializer,
    UserActivityLogSerializer,
)
from .models import (
    User,
    ContactMessage,
    NewsletterSubscription,
    News,
    UserSession,
    Crop,
    Tool,
    Tip,
    CropRecommendation,
    FarmingActivity,
    UserActivityLog,
)
from .email_utils import send_login_notification, send_logout_notification, send_otp_email
from django.core.cache import cache
import random
from rest_framework.views import APIView
import pickle
import os
from django.conf import settings
from sklearn.metrics.pairwise import cosine_similarity
from django.db import models
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import joblib


# Register API
class RegisterApi(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args,  **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token.key
        })

# Login API
class LoginApi(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(LoginApi, self).post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        send_login_notification(token.user)
        return Response({
            'token': token.key,
            'user_id': token.user.pk,
            'email': token.user.email
        })

# Get User API
class UserApi(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

# Hello API
class HelloApi(APIView):
    def get(self, request):
        return Response({"message": "Hello from the backend!"})

# Contact Message API
class ContactMessageCreate(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

# Newsletter Subscription API
class NewsletterSubscriptionCreate(generics.CreateAPIView):
    queryset = NewsletterSubscription.objects.all()
    serializer_class = NewsletterSubscriptionSerializer

# News List API
class NewsList(generics.ListAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer

# News Detail API
class NewsDetail(generics.RetrieveAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer

# Unified Search View
class UnifiedSearchView(APIView):
    def get(self, request):
        query = self.request.query_params.get('q', '')
        if not query:
            return Response({})

        index_path = os.path.join(settings.BASE_DIR, 'search_index')
        
        try:
            with open(os.path.join(index_path, 'vectorizer.pkl'), 'rb') as f:
                vectorizer = pickle.load(f)
            
            with open(os.path.join(index_path, 'tfidf_matrix.pkl'), 'rb') as f:
                tfidf_matrix = pickle.load(f)

            with open(os.path.join(index_path, 'document_pks.pkl'), 'rb') as f:
                document_pks = pickle.load(f)

            with open(os.path.join(index_path, 'document_types.pkl'), 'rb') as f:
                document_types = pickle.load(f)

        except FileNotFoundError:
            return Response({})

        query_vector = vectorizer.transform([query])
        cosine_similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()
        
        # Get the top 10 most similar documents
        related_docs_indices = cosine_similarities.argsort()[:-11:-1]
        
        results = {
            'news': [],
            'crops': [],
            'tools': [],
            'tips': [],
        }

        for i in related_docs_indices:
            doc_type = document_types[i]
            doc_pk = document_pks[i]

            if doc_type == 'news':
                item = News.objects.get(pk=doc_pk)
                serializer = NewsSerializer(item)
                results['news'].append(serializer.data)
            elif doc_type == 'crop':
                item = Crop.objects.get(pk=doc_pk)
                serializer = CropSerializer(item)
                results['crops'].append(serializer.data)
            elif doc_type == 'tool':
                item = Tool.objects.get(pk=doc_pk)
                serializer = ToolSerializer(item)
                results['tools'].append(serializer.data)
            elif doc_type == 'tip':
                item = Tip.objects.get(pk=doc_pk)
                serializer = TipSerializer(item)
                results['tips'].append(serializer.data)

        return Response(results)


class CropViewSet(viewsets.ModelViewSet):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer


class TipViewSet(viewsets.ModelViewSet):
    queryset = Tip.objects.all()
    serializer_class = TipSerializer


class ToolViewSet(viewsets.ModelViewSet):
    queryset = Tool.objects.all()
    serializer_class = ToolSerializer


# User Session Start API
class UserSessionStart(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSessionSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# User Session End API
class UserSessionEnd(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        session = UserSession.objects.filter(user=request.user).latest('started_at')
        session.ended_at = timezone.now()
        session.save()
        send_logout_notification(request.user)
        return Response(status=status.HTTP_200_OK)

# Crop Recommendation
MODEL_PATH = os.path.join(settings.BASE_DIR, "api", "model.joblib")
ENCODER_PATH = os.path.join(settings.BASE_DIR, "api", "encoder.joblib")


def train_model():
    # Load the dataset
    df = pd.read_csv(os.path.join(settings.BASE_DIR, "api", "Crop_recommendation.csv"))

    X = df.drop("label", axis=1)
    y = df["label"]

    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42
    )

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Save the model and encoder
    joblib.dump(model, MODEL_PATH)
    joblib.dump(label_encoder, ENCODER_PATH)


# Train model if it doesn't exist
if not os.path.exists(MODEL_PATH) or not os.path.exists(ENCODER_PATH):
    train_model()

# Load the model and encoder
model = joblib.load(MODEL_PATH)
label_encoder = joblib.load(ENCODER_PATH)


class CropRecommendationView(APIView):

    def post(self, request):
        try:
            data = request.data
            input_data = pd.DataFrame(
                [
                    [
                        data["N"],
                        data["P"],
                        data["K"],
                        data["temperature"],
                        data["humidity"],
                        data["ph"],
                        data["rainfall"],
                    ]
                ],
                columns=[
                    "N",
                    "P",
                    "K",
                    "temperature",
                    "humidity",
                    "ph",
                    "rainfall",
                ],
            )

            prediction = model.predict(input_data)[0]
            crop_name = label_encoder.inverse_transform([prediction])[0]

            return Response({"predicted_crop": crop_name}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class AcceptRecommendationView(APIView):

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

        crop_name = request.data.get('crop_name')
        if not crop_name:
            return Response({"error": "Crop name is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Create and save the crop recommendation
        recommendation = CropRecommendation.objects.create(
            user=request.user,
            predicted_crop=crop_name,
            is_accepted=True,
            N=request.data.get('N'),
            P=request.data.get('P'),
            K=request.data.get('K'),
            temperature=request.data.get('temperature'),
            humidity=request.data.get('humidity'),
            ph=request.data.get('ph'),
            rainfall=request.data.get('rainfall'),
        )

        # Fetch the Day 1 farming activity for the recommended crop
        try:
            farming_activity = FarmingActivity.objects.get(crop__iexact=crop_name, day=1)
        except FarmingActivity.DoesNotExist:
            return Response({"error": f"No Day 1 activity found for {crop_name}."}, status=status.HTTP_404_NOT_FOUND)

        # Create a user activity log for the Day 1 activity
        user_activity_log = UserActivityLog.objects.create(
            user=request.user,
            activity=farming_activity,
        )

        serializer = UserActivityLogSerializer(user_activity_log)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class FarmingActivityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FarmingActivitySerializer

    def get_queryset(self):
        crop = self.request.query_params.get("crop")
        if crop:
            return FarmingActivity.objects.filter(crop__iexact=crop)
        return FarmingActivity.objects.all()


from rest_framework.decorators import action

class UserActivityLogViewSet(viewsets.ModelViewSet):
    queryset = UserActivityLog.objects.all()
    serializer_class = UserActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserActivityLog.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Here you can add the logic to analyze the image and text
        # For now, we'll just save it and mark as not verified.
        serializer.save(user=self.request.user, is_verified=False)

    @action(detail=True, methods=['post'])
    def mark_as_complete(self, request, pk=None):
        user_activity_log = self.get_object()
        user_activity_log.is_completed = True
        user_activity_log.status = 'completed'
        user_activity_log.save()
        serializer = self.get_serializer(user_activity_log)
        return Response(serializer.data)

class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        
        try:
            latest_recommendation = CropRecommendation.objects.filter(user=user, is_accepted=True).latest('created_at')
            recommendation_serializer = CropRecommendationSerializer(latest_recommendation)
            recommendation_data = recommendation_serializer.data
        except CropRecommendation.DoesNotExist:
            recommendation_data = None

        user_activities = UserActivityLog.objects.filter(user=user)
        activities_serializer = UserActivityLogSerializer(user_activities, many=True)

        data = {
            'recommendation': recommendation_data,
            'activities': activities_serializer.data,
        }
        
        return Response(data)

class SendUsernameChangeOTP(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        otp = random.randint(100000, 999999)
        cache.set(f'username_change_otp_{user.id}', otp, 300)  # Cache for 5 minutes
        send_otp_email(user, otp)
        return Response({'message': 'OTP sent successfully.'}, status=status.HTTP_200_OK)

class VerifyUsernameChangeOTP(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        otp = request.data.get('otp')
        new_username = request.data.get('username')
        cached_otp = cache.get(f'username_change_otp_{user.id}')

        if not otp or not new_username:
            return Response({'error': 'OTP and new username are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not cached_otp:
            return Response({'error': 'OTP has expired.'}, status=status.HTTP_400_BAD_REQUEST)

        if str(cached_otp) != str(otp):
            return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        user.username = new_username
        user.save()
        cache.delete(f'username_change_otp_{user.id}')
        return Response({'message': 'Username updated successfully.'}, status=status.HTTP_200_OK)
