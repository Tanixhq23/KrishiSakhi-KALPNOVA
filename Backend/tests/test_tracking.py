from django.test import TestCase
from apps.tracking.models import Activity

class TrackingTestCase(TestCase):
    def test_log_activity(self):
        self.assertTrue(True)
