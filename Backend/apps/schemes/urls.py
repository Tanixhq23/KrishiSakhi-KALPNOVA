from django.urls import path
from . import views

urlpatterns = [
    path("mandi/", views.mandi_prices_view, name="mandi_prices"),
    path("sync-schemes/", views.fetch_and_persist_schemes, name="sync_schemes"),
]
