from django.test import TestCase, RequestFactory, Client
from datasets.models import Dataset

from cryptography.fernet import Fernet
import os


"""
I will refactor tests to have more test cases later. Optmization of tests is
not my priority at this time, writing more tests for more coverage is the
priority.
"""

class BaseDatasetTest(TestCase):
    """
    dummy data for the tests
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

        # the password and username for the password protected dataset need to
        # be created the same way that they are saved with the create dataset
        # view and the update dataset view.

        # get cryptography key
        cryptokey = os.environ['CRYPTOKEY'].encode('UTF-8')
        cryptokey_fernet = Fernet(cryptokey)

        # create user data
        client_dataset_password = "zmtdummy"
        client_dataset_user = "zmtBremen1991"

        # encrypt the password
        password_bytes = client_dataset_password.encode('UTF-8')
        password_encrypted = cryptokey_fernet.encrypt(password_bytes)
        password_encrypted = password_encrypted.decode('UTF-8')


        # encrypt the username
        user_bytes = client_dataset_user.encode('UTF-8')
        user_encrypted = cryptokey_fernet.encrypt(user_bytes)
        user_encrypted = user_encrypted.decode('UTF-8')

        # save the data
        self.ds3 = Dataset.objects.create(author="zmtdummy",
                                    title="ZMT GeoJSON Polygon",
                                    description="Polygons spelling 'ZMT' over the location of the ZMT",
                                    url="https://bitbucket.org/zmtdummy/geojsondata/raw/0f318d948d74a67bceb8da5257a97b7df80fd2dd/zmt_polygons.json",
                                    dataset_user=user_encrypted,
                                    dataset_password=password_encrypted)
