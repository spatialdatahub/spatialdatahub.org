from django.core.urlresolvers import resolve
from django.http import HttpRequest

from datasets.models import Dataset
from .base import BaseDatasetTest

from datasets.views import load_dataset

import os

class LoadDatasetViewTests(BaseDatasetTest):

    def test_load_dataset_returns_correct_content(self):
        pk = self.ds2.pk
        request = HttpRequest()
        response = load_dataset(request, pk)
        self.assertIn(b"Starbucks", response.content)


    def test_load_dataset_decrypts_dataset_password(self):
        test_url = '/load_dataset/{pk}/'.format(pk=self.ds3.pk)
        response = self.client.get(test_url)
        print(response.context)
        self.assertIn(b"properties",
            response.content)

