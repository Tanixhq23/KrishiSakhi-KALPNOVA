from django.core.management.base import BaseCommand
from api.models import Crop, Tool, Tip

class Command(BaseCommand):
    help = 'Seeds the database with sample data for Crops, Tools, and Tips.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding Crops, Tools, and Tips...')
        
        # Clear existing data
        Crop.objects.all().delete()
        Tool.objects.all().delete()
        Tip.objects.all().delete()

        # Seed Crops
        crop_data = [
            {"name": "Rice", "description": "A staple food for a large part of the world's human population. It is the grain with the second-highest worldwide production, after maize (corn)."},
            {"name": "Wheat", "description": "A cereal grain, which is a worldwide staple food. The many species of wheat together make up the genus Triticum; the most widely grown is common wheat."},
            {"name": "Sugarcane", "description": "A tall perennial grass species of the genus Saccharum, tribe Andropogoneae, used for sugar production."},
        ]
        for item in crop_data:
            Crop.objects.create(**item)
        self.stdout.write(self.style.SUCCESS('Crops seeded successfully.'))

        # Seed Tools
        tool_data = [
            {"name": "Tractor", "description": "A powerful motor vehicle with large, heavy treads, used for pulling farm machinery and other vehicles."},
            {"name": "Plow", "description": "A large farming implement with one or more blades fixed in a frame, drawn by a tractor or by animals and used for cutting furrows in the soil and turning it over, to prepare for the planting of seeds."},
            {"name": "Harvester", "description": "A machine for harvesting a crop. A combine harvester is a machine that harvests grain crops."},
        ]
        for item in tool_data:
            Tool.objects.create(**item)
        self.stdout.write(self.style.SUCCESS('Tools seeded successfully.'))

        # Seed Tips
        tip_data = [
            {"title": "Pest Control for Rice", "content": "Use integrated pest management (IPM) techniques to control pests in rice paddies. This includes using resistant varieties, biological control agents, and targeted pesticide applications.", "category": "Pest Control"},
            {"title": "Fertilizing Wheat", "content": "Apply nitrogen fertilizer in split doses to maximize uptake by the wheat crop. A soil test is recommended to determine the optimal fertilizer rate.", "category": "Fertilization"},
            {"title": "Irrigating Sugarcane", "content": "Sugarcane has high water requirements. Drip irrigation is a highly efficient method that can save water and improve yields.", "category": "Irrigation"},
        ]
        for item in tip_data:
            Tip.objects.create(**item)
        self.stdout.write(self.style.SUCCESS('Tips seeded successfully.'))

        self.stdout.write(self.style.SUCCESS('All data seeded successfully.'))
