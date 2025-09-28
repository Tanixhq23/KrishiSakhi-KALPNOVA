from django.contrib import admin

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

# Register your models here.
admin.site.register(Tip)
admin.site.register(Tool)
admin.site.register(CropRecommendation)
admin.site.register(FarmingActivity)
admin.site.register(UserActivityLog)
