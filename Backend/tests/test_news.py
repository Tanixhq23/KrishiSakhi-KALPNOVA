from django.test import TestCase
from apps.news.fetcher import fetch_daily_news

class NewsTestCase(TestCase):
    def test_fetch_news(self):
        data = fetch_daily_news(limit=2)
        self.assertIsInstance(data, list)
