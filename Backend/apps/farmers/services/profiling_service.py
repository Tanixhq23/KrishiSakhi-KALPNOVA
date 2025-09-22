from ..models import Farmer

def get_farmer_profile(farmer_id):
    try:
        return Farmer.objects.get(id=farmer_id)
    except Farmer.DoesNotExist:
        return None
