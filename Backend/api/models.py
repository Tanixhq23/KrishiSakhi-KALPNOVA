from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


class NewsletterSubscription(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


class UserSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_key = models.CharField(max_length=40, null=True, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.session_key}"


class News(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='news_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Crop(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='crop_images/', blank=True, null=True)

    def __str__(self):
        return self.name

class Tool(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


class Tip(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.title


class CropRecommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    N = models.FloatField()
    P = models.FloatField()
    K = models.FloatField()
    temperature = models.FloatField()
    humidity = models.FloatField()
    ph = models.FloatField()
    rainfall = models.FloatField()
    predicted_crop = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    is_accepted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.predicted_crop}"

class FarmingActivity(models.Model):
    crop = models.CharField(max_length=100)
    day = models.IntegerField()
    task = models.CharField(max_length=255)
    instructions = models.TextField()

    def __str__(self):
        return f"{self.crop} - Day {self.day}: {self.task}"

class UserActivityLog(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity = models.ForeignKey(FarmingActivity, on_delete=models.CASCADE)
    completion_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='activity_logs/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.user.username} - {self.activity.task} - {self.get_status_display()}"