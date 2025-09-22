from .models import Activity

def log_activity(farmer, activity_type, description=""):
    return Activity.objects.create(farmer=farmer, activity_type=activity_type, description=description)
