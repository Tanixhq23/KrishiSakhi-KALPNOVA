from .mongo_connector import db

def seed_news_sample():
    db.news.insert_one({"title": "Test News", "source": "seed", "body": "sample"})
