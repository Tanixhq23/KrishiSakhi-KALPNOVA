from django.db import models

class Activity(models.Model):
    farmer = models.ForeignKey('farmers.Farmer', on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
