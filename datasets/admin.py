from django.contrib import admin
from datasets.models import Dataset
from datasets.models import Keyword

admin.site.register(Dataset)
admin.site.register(Keyword)
