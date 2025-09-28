from django.core.management.base import BaseCommand
from api.models import News

class Command(BaseCommand):
    help = 'Seeds the database with sample news articles.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding news articles...')
        
        News.objects.all().delete()

        news_data = [
            {
                "title": "The Benefits of Drip Irrigation for Water Conservation",
                "content": "Drip irrigation is a highly efficient method of watering crops. It delivers water directly to the root zone, minimizing evaporation and runoff. This technique can save up to 70% of water compared to traditional flood irrigation. It is particularly useful in arid and semi-arid regions where water is scarce. Farmers who adopt drip irrigation often see increased crop yields and quality."
            },
            {
                "title": "How to Grow Rice: A Step-by-Step Guide",
                "content": "Growing rice requires a specific set of conditions. The process starts with land preparation, followed by planting seedlings in a flooded paddy. Water management is crucial throughout the growing season. Fertilization and pest control are also important for a healthy crop. Harvesting is typically done when the grains have turned golden yellow."
            },
            {
                "title": "The Latest Tractor Models for Modern Farming",
                "content": "Modern tractors come equipped with advanced features like GPS guidance, autonomous steering, and data management systems. These technologies help farmers optimize their field operations, reduce fuel consumption, and increase efficiency. Some of the leading brands include John Deere, Case IH, and New Holland. Choosing the right tractor depends on the size of the farm and the type of crops being cultivated."
            },
            {
                "title": "Organic Farming: Tips for a Healthy Harvest",
                "content": "Organic farming focuses on sustainable practices that avoid the use of synthetic fertilizers and pesticides. Key principles include crop rotation, companion planting, and the use of natural pest control methods. Building healthy soil is the foundation of organic farming. Compost and manure are excellent natural fertilizers. While organic farming can be more labor-intensive, it produces healthy, chemical-free food."
            }
        ]

        for item in news_data:
            News.objects.create(**item)

        self.stdout.write(self.style.SUCCESS('News articles seeded successfully.'))
