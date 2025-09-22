from django.test import TestCase
from apps.farmers.models import Farmer

class FarmerTestCase(TestCase):
    def test_create_farmer(self):
        f = Farmer.objects.create(name="Test Farmer", location="Bhopal", land_size=1.2)
        self.assertEqual(f.name, "Test Farmer")
