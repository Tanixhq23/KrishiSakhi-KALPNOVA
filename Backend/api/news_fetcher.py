import requests
from django.conf import settings
from .models import News
from django.core.management import call_command

def fetch_news():
    """
    Fetches news from the NewsAPI, saves new articles to the database,
    and updates the search index.
    """
    print("Fetching news...")
    url = f"https://newsapi.org/v2/everything?q=agriculture%20AND%20india&apiKey={settings.NEWS_API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        data = response.json()
        articles = data.get('articles', [])

        new_articles_found = False
        for article in articles:
            # Check if the article already exists
            if not News.objects.filter(title=article['title']).exists():
                News.objects.create(
                    title=article['title'],
                    content=article['description'] or '',
                    image=article.get('urlToImage', '')
                )
                new_articles_found = True
        
        if new_articles_found:
            print("New articles found, updating search index...")
            call_command('create_search_index')
        else:
            print("No new articles found.")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching news: {e}")

