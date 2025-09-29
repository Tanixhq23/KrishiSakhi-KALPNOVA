from django.urls import path, include
from rest_framework import routers
from .views import RegisterApi, LoginApi, UserApi, HelloApi, ContactMessageCreate, NewsletterSubscriptionCreate, NewsList, NewsDetail, UnifiedSearchView, UserSessionStart, UserSessionEnd, CropRecommendationView, AcceptRecommendationView, DashboardView, SendUsernameChangeOTP, VerifyUsernameChangeOTP
from .views import CropViewSet, TipViewSet, ToolViewSet, UserActivityLogViewSet, FarmingActivityViewSet

router = routers.DefaultRouter()
router.register(r"crops", CropViewSet)
router.register(r"tips", TipViewSet)
router.register(r"tools", ToolViewSet)
router.register(r"user-activities", UserActivityLogViewSet)
router.register(r"farming-activities", FarmingActivityViewSet, basename="farming-activity")

urlpatterns = [
    path("", include(router.urls)),
    path('auth/register/', RegisterApi.as_view()),
    path('auth/login/', LoginApi.as_view()),
    path('auth/user/', UserApi.as_view()),
    path('hello/', HelloApi.as_view()),
    path('contact/', ContactMessageCreate.as_view()),
    path('subscribe/', NewsletterSubscriptionCreate.as_view()),
    path('news/', NewsList.as_view()),
    path('news/<int:pk>/', NewsDetail.as_view()),
    path('search/', UnifiedSearchView.as_view(), name="search"),
    path('recommend-crop/', CropRecommendationView.as_view(), name="recommend-crop"),
    path('accept-crop-recommendation/', AcceptRecommendationView.as_view(), name="accept-recommendation"),
    path('session/start/', UserSessionStart.as_view()),
    path('session/end/', UserSessionEnd.as_view()), 
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('auth/send-username-otp/', SendUsernameChangeOTP.as_view(), name='send-username-otp'),
    path('auth/verify-username-otp/', VerifyUsernameChangeOTP.as_view(), name='verify-username-otp'),
]