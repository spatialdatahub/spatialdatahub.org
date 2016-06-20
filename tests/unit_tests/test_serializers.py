from django.test import TestCase
from django.core.serializers import serialize

import requests
import json

from datasets.models import Dataset
from datasets.serializers import dataset_model_serializer

from .base import BaseDatasetTest

class DatasetModelSerializerTests(BaseDatasetTest):
    """
    This test class will test whether dataset objects can be serialized, and
    whether
    """

    def test_that_the_dataset_model_serializer_actually_serializes(self):
        """
        Compare the defined method with the django methods
        """

        # Get the dataset list, and order it the way the method should
        dataset_list = Dataset.objects.all().order_by('title')
        serialized_dataset_list = dataset_model_serializer(dataset_list)

        self.assertEqual(serialized_dataset_list[0]['pk'],
                         json.loads(serialize('json', dataset_list))[0]['pk'])
        self.assertEqual(serialized_dataset_list[1]['fields']['title'],
                         json.loads(serialize('json',
                             dataset_list))[1]['fields']['title'])


        # Make sure that dataset object ds3 ends with json
        # ds3 has the title 'Bienvendidos GeoJSON Polygon'

        self.assertEqual(self.ds3.url.lower().endswith('.json'), True)

        # Get the corresponding serialized dataset object
        for obj in serialized_dataset_list:
            if obj['fields']['title'] == 'Bienvenidos GeoJSON Polygon':
                sds3 = obj
                self.assertEqual(sds3['fields']['url'].lower().endswith('.json'),
                    True)
                self.assertEqual(sds3['fields']['extension'], 'json')

    def test_dataset_model_serializer_does_not_return_password_and_username(self):
        """
        Check that password and username are gone.
        """

        dataset_list = Dataset.objects.exclude(dataset_password__exact="")

        serialized_dataset_list = dataset_model_serializer(dataset_list)
        self.assertNotEqual(dataset_list[0].dataset_password,
            serialized_dataset_list[0]['fields']['dataset_password'])
        self.assertNotEqual(dataset_list[0].dataset_user,
            serialized_dataset_list[0]['fields']['dataset_user'])

        self.assertEqual(serialized_dataset_list[0]['fields']['status_code'],
                         200)
