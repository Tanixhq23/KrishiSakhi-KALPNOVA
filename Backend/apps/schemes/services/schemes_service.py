from ..models import Scheme

def get_all_schemes():
    return Scheme.objects.all()
