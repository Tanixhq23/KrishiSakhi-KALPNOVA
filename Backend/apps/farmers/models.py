from django.db import models

class Farmer(models.Model):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=255)
    state = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    land_size = models.FloatField(help_text="Area in acres", default=0.0)
    soil_type = models.CharField(max_length=100, blank=True, null=True)
    irrigation = models.CharField(max_length=100, blank=True, null=True)
    preferred_crops = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.name} ({self.location})"
