from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from datasets.models import Dataset

from selenium import webdriver

class BaseLiveTest(StaticLiveServerTestCase):
    """
    In the setUp we will also create a dummy dataset to be manipulated.
    """

    @classmethod
    def setUp(self):
        self.browser = webdriver.Firefox()
#        self.browser = webdriver.Chrome()
        self.browser.implicitly_wait(3)
        self.dummy_dataset = Dataset.objects.create(title='dummy dataset',
                                 author='dummy_author',
                                 description='dummy dataset description',
                                 url='https://raw.githubusercontent.com/' +
                                 'zmtdummy/GeoJsonData/master/bienvenidos.json')
        """
        self.dummy_dataset_password = Dataset.objects.create(title='dummy dataset with password',
                                 author='dummy_author',
                                 description='dummy dataset description, this' +
                                     'one is password protected',
                                 url='https://raw.githubusercontent.com/' +
                                 'zmtdummy/GeoJsonData/master/bienvenidos.json')
        """


        self.dummy_kml_dataset = Dataset.objects.create(
                                 author="KML_Test",
                                 title="KML Test Dataset",
                                 description="This is a KML test dataset",
                                 url="https://raw.githubusercontent.com/zmtdummy/"
                                     + "GeoJsonData/master/westcampus.kml")

    @classmethod
    def tearDown(self):
        self.browser.quit()

