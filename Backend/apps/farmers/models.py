from django.db import models

class Farmer(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    land_size = models.FloatField()
    soil_type = models.CharField(max_length=100)
    irrigation = models.CharField(max_length=100)

    def __str__(self):
        return self.name
