import os
import feedparser

PIB_FEED_URL = os.getenv("PIB_FEED_URL", "https://pib.gov.in/PressReleaseRssFeed.aspx?MinID=31")

def fetch_daily_news(limit=10):
    feed = feedparser.parse(PIB_FEED_URL)
    entries = feed.entries or []
    out = []
    for e in entries[:limit]:
        out.append({
            "title": getattr(e, "title", ""),
            "link": getattr(e, "link", ""),
            "published": getattr(e, "published", ""),
            "summary": getattr(e, "summary", "")
        })
    return out
