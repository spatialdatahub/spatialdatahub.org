from django.test import TestCase
from django.utils.text import slugify

import requests
import json

from datasets.models import Dataset

from .base import BaseDatasetTest

class DataSetModelTests(BaseDatasetTest):
    """
    This class will test that (1) dataset references and metadata can be saved,
    (2) that data at the dataset urls can be accessed through the python requests
    module, that (3) data at dataset urls requiring passwords can be accessed through
    python requests, and (4) that access to datasets can be limited by dataset
    authors via needing authentication. (5) Test that the __str__ method returns
    the dataset title, and (6) that the get_absolute_url method returns the correct
    url, and that it can be found.
    """


    # 1
    def test_dataset_can_be_saved_and_found(self):

        # Use the set up from the tests.base.py

        Dataset_List = Dataset.objects.all()
        self.assertEqual(Dataset_List[0].author, "Google")
        self.assertEqual(Dataset_List[0].slug, "google-geojson-example")
        self.assertNotEqual(Dataset_List[1].url, self.ds1.url)


    # 2
    def test_that_data_set_can_be_accessed_with_python_requests(self):

        # Use the set up from the tests.base.py




        r1 = requests.get(self.ds1.url)
        r2 = requests.get(self.ds2.url)

        self.assertEqual(r1.status_code, 200)
        self.assertEqual(r2.status_code, 200)
        self.assertEqual(r2.json()['id'], 'mapbox.o11ipb8h')

    # 3
    def test_that_data_set_at_password_protected_url_can_be_accessed_with_python_requests(self):

        # Use the set up from the tests.base.py

        # GeoJSON dataset on public github repository
        r3 = requests.get(self.ds3.url)

        # GeoJSON dataset on private bitbucket repository
        r4 = requests.get(self.ds4.url, auth=(self.ds4.dataset_user, self.ds4.dataset_password))

        self.assertEqual(r3.status_code, 200)
        self.assertEqual(r4.status_code, 200)


    # 4
    def test_dataset_access_is_limited_by_user_authentication(self):

        pass


    # 5
    def test_title_of_dataset_entry(self):
        # Use the set up from the tests.base.py

        self.assertTrue(isinstance(self.ds1, Dataset))
        self.assertEqual(self.ds1.__str__(), self.ds1.title)


    # 6
    def test_get_absolute_url_returns_correct_url(self):
        # Use the set up from the tests.base.py

        title = "This is my test title"
        dataset_entry = Dataset.objects.create(title=title, author="Test Testerson",
                                               description="This is a test dataset",
                                               url="http://www.google.com")

        slug = slugify(title)
        expected_url_1 = "/{slug}-{pk}/".format(slug=slug, pk=dataset_entry.pk,)
        expected_url_2 = '/' + slugify(self.ds1.title + '-' + str(self.ds1.pk)) + '/'

        self.assertEqual(dataset_entry.get_absolute_url(), expected_url_1)
        self.assertEqual(self.ds1.get_absolute_url(), expected_url_2)
