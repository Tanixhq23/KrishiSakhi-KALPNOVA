from django.test import TestCase
from apps.advisory.ai_advisory_service import generate_advisory

class AdvisoryTestCase(TestCase):
    def test_generate_advisory(self):
        result = generate_advisory({})
        self.assertIn("advisory", result)
