from django.db import models

from datasets.models import Dataset

class Keyword(models.Model):
    # keywords should be unique, and they should not be blank
    keyword = models.CharField(
        max_length=100, blank=False, null=False, unique=True)
    datasets = models.ManyToManyField(Dataset)

    def __str__(self):
        return self.keyword
