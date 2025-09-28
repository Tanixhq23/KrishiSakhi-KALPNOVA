from django.core.management.base import BaseCommand
from apscheduler.schedulers.blocking import BlockingScheduler
from api.news_fetcher import fetch_news

class Command(BaseCommand):
    help = 'Starts the scheduler to fetch news periodically.'

    def handle(self, *args, **options):
        scheduler = BlockingScheduler()
        scheduler.add_job(fetch_news, 'interval', minutes=15)
        
        self.stdout.write("Starting scheduler...")
        try:
            scheduler.start()
        except (KeyboardInterrupt, SystemExit):
            pass
        self.stdout.write("Scheduler stopped.")
