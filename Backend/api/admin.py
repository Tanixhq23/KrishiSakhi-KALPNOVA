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
admin.site.register(ContactMessage)
admin.site.register(News)
admin.site.register(NewsletterSubscription)
admin.site.register(UserSession)
admin.site.register(Crop)
