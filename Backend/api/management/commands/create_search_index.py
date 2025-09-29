from django.core.management.base import BaseCommand
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from api.models import News, Crop, Tool, Tip
import pickle
import os
from django.conf import settings

class Command(BaseCommand):
    help = 'Creates a unified search index for all content types.'

    def handle(self, *args, **options):
        self.stdout.write('Downloading NLTK data...')
        nltk.download('punkt')
        nltk.download('stopwords')
        self.stdout.write(self.style.SUCCESS('NLTK data downloaded successfully.'))

        self.stdout.write('Creating unified search index...')
        
        documents = []
        document_pks = []
        document_types = []

        # Index News
        for item in News.objects.all():
            if item.title and item.content:
                documents.append(f"{item.title} {item.content}")
                document_pks.append(item.pk)
                document_types.append('news')

        # Index Crops
        for item in Crop.objects.all():
            if item.name and item.description:
                documents.append(f"{item.name} {item.description}")
                document_pks.append(item.pk)
                document_types.append('crop')

        # Index Tools
        for item in Tool.objects.all():
            if item.name and item.description:
                documents.append(f"{item.name} {item.description}")
                document_pks.append(item.pk)
                document_types.append('tool')

        # Index Tips
        for item in Tip.objects.all():
            if item.title and item.content:
                documents.append(f"{item.title} {item.content}")
                document_pks.append(item.pk)
                document_types.append('tip')

        if not documents:
            self.stdout.write(self.style.WARNING('No documents to index.'))
            return
        
        # Create a TF-IDF vectorizer
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(documents)
        
        # Save the vectorizer, the TF-IDF matrix, and the document metadata
        index_path = os.path.join(settings.BASE_DIR, 'search_index')
        os.makedirs(index_path, exist_ok=True)
        
        with open(os.path.join(index_path, 'vectorizer.pkl'), 'wb') as f:
            pickle.dump(vectorizer, f)
            
        with open(os.path.join(index_path, 'tfidf_matrix.pkl'), 'wb') as f:
            pickle.dump(tfidf_matrix, f)

        with open(os.path.join(index_path, 'document_pks.pkl'), 'wb') as f:
            pickle.dump(document_pks, f)

        with open(os.path.join(index_path, 'document_types.pkl'), 'wb') as f:
            pickle.dump(document_types, f)
            
        self.stdout.write(self.style.SUCCESS('Unified search index created successfully.'))
