from django.test import TestCase
from apps.farmers.models import Farmer

class FarmerTestCase(TestCase):
    def test_create_farmer(self):
        f = Farmer.objects.create(name="Test", location="Kerala", land_size=1.0, soil_type="Loam", irrigation="Drip")
        self.assertEqual(f.name, "Test")
