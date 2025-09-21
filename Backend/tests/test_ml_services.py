import unittest
from ml_services.disease_detection.predictor import predict_disease

class MLTestCase(unittest.TestCase):
    def test_predict(self):
        self.assertEqual(predict_disease(None)["disease"], "Healthy")
