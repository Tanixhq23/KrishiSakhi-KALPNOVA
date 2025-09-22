from django.db import models
from apps.farmers.models import Farmer

class Activity(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE, related_name="activities")
    activity_type = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.farmer.name} - {self.activity_type} at {self.timestamp}"
