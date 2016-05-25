from django.test import TestCase

import requests
import json

from datasets.models import Dataset


class DataSetModelTests(TestCase):
    """
    This class will test that (1) dataset references and metadata can be saved,
    (2) that data at the dataset urls can be accessed through the python requests
    module, that (3) data at dataset urls requiring passwords can be accessed through
    python requests, and (4) that access to datasets can be limited by dataset
    authors via needing authentication.
    """

    def setUp(self):

        self.ds1 = Dataset.objects.create(author="Google",
                                    title="Google GeoJSON Example",
                                    description="Polygons spelling 'GOOGLE' over Australia",
                                    url="https://storage.googleapis.com/maps-devrel/google.json",
                                    public_access=True)

        self.ds2 = Dataset.objects.create(author="mapbox",
                                    title="Mapbox GeoJson Example",
                                    description="Data points representing starbucks locations in New York City",
                                    url="http://api.tiles.mapbox.com/v3/mapbox.o11ipb8h/markers.geojson",
                                    public_access=True)

        self.ds3 = Dataset.objects.create(author="zmtdummy",
                                    title="Bienvenidos GeoJSON Polygon",
                                    description="Polygons spelling 'Bienvenidos' over the United States",
                                    url="https://raw.githubusercontent.com/zmtdummy/GeoJsonData/master/bienvenidos.json")

        self.ds4 = Dataset.objects.create(author="zmtdummy",
                                    title="ZMT GeoJSON Polygon",
                                    description="Polygons spelling 'ZMT' over the location of the ZMT",
                                    url="https://bitbucket.org/zmtdummy/geojsondata/raw/0f318d948d74a67bceb8da5257a97b7df80fd2dd/zmt_polygons.json",
                                    dataset_user="zmtdummy",
                                    dataset_password="zmtBremen1991")

    # 1
    def test_dataset_can_be_saved_and_found(self):

        Dataset_List = Dataset.objects.all()
        self.assertEqual(Dataset_List[0].author, "Google")
        self.assertEqual(Dataset_List[0].slug, "google-geojson-example")
        self.assertNotEqual(Dataset_List[1].url, self.ds1.url)

    # 2
    def test_that_data_set_can_be_accessed_with_python_requests(self):

        r1 = requests.get(self.ds1.url)
        r2 = requests.get(self.ds2.url)

        self.assertEqual(r1.status_code, 200)
        self.assertEqual(r2.status_code, 200)
        self.assertEqual(r2.json()['id'], 'mapbox.o11ipb8h')

    # 3
    def test_that_data_set_at_password_protected_url_can_be_accessed_with_python_requests(self):

        # GeoJSON dataset on public github repository
        r3 = requests.get(self.ds3.url)

        # GeoJSON dataset on private bitbucket repository
        r4 = requests.get(self.ds4.url, auth=(self.ds4.dataset_user, self.ds4.dataset_password))

        self.assertEqual(r3.status_code, 200)
        self.assertEqual(r4.status_code, 200)

    # 4
    def test_dataset_access_is_limited_by_user_authentication(self):

        pass


