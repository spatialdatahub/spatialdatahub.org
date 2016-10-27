from django.test import TestCase
from datasets.models import Dataset

from .base import BaseDatasetTest

from datasets.views import PortalView


class PortalViewTestsThatRequireData_EMPTY_DATABASE(TestCase):

    def test_that_PortalView_without_datasets_says_none_available(self):
        response = self.client.get('/')
        self.assertIn('There are no datasets available',
            response.content.decode('utf-8'))

    def test_that_PortalView_brings_in_correct_number_of_dataset_objects(self):
        response = self.client.get('/')
        self.assertEqual(0, len(response.context['dataset_list']))


class PortalViewTestsThatRequireData(BaseDatasetTest):

    def test_base_url_resolves_to_PortalView(self):
        request = self.factory.get('')
        response = PortalView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_PortalView_uses_correct_template(self):
        response = self.client.get('/')
        self.assertTemplateUsed(response,
            template_name="datasets/portal.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_PortalView_title_is_correct(self):
        response = self.client.get('/')
        self.assertIn('<title>ZMT | GIS Portal</title>', response.content.decode('utf-8'))

    def test_that_PortalView_brings_in_correct_number_of_dataset_objects(self):
        response = self.client.get('/')
        self.assertEqual(3, len(response.context['dataset_list']))

    def test_that_PortalView_brings_in_correct_list_of_dataset_objects(self):
        response = self.client.get('/')
        object_list = Dataset.objects.all()
        for index, ds in enumerate(object_list):
            self.assertEqual(ds, response.context['dataset_list'][index])

    def test_PortalView_search_function(self):
        """
        This will be refactoed to use an ajax call
        """

        # Use the set up from the tests file in the datasets app
        # then filter them and check
        dataset_list = Dataset.objects.filter(title__contains=('ZMT'))
        self.assertEqual(len(dataset_list), 1)

        # now run it as a get request for "zmt"
        response = self.client.get('/?q=zmt')
        self.assertEqual(response.status_code, 200)
        self.assertIn('ZMT GeoJSON Polygon', response.content.decode('utf-8'))
        self.assertNotIn('Mapbox GeoJson Example', response.content.decode('utf-8'))
