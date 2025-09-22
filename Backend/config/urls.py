from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/farmers/", include("apps.farmers.urls")),
    path("api/tracking/", include("apps.tracking.urls")),
    path("api/schemes/", include("apps.schemes.urls")),
    path("api/news/", include("apps.news.urls")),
]
