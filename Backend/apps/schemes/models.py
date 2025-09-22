from django.db import models

class Scheme(models.Model):
    title = models.CharField(max_length=512)
    description = models.TextField(blank=True, null=True)
    eligibility = models.TextField(blank=True, null=True)
    source_url = models.URLField(blank=True, null=True)
    meta = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.title
