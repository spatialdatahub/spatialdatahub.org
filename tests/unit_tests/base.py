from django.test import TestCase, RequestFactory, Client

from datasets.models import Dataset


class BaseDatasetTest(TestCase):
    """
    This simply setting up dummy data for the rest of the tests
    """

    @classmethod
    def setUp(self):

        self.factory = RequestFactory()
        self.client = Client()

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

        self.ds5 = Dataset.objects.create(author="KML_Test",
                                    title="KML Test Dataset",
                                    description="This is a KML test dataset",
                                    url="https://raw.githubusercontent.com/zmtdummy/GeoJsonData/master/westcampus.kml")
