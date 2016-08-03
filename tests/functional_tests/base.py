from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from datasets.models import Dataset

from selenium import webdriver

class CssBaseLiveTest(StaticLiveServerTestCase):
    """
    In the setUp we will also create a dummy dataset to be manipulated.
    """

    @classmethod
    def setUp(self):
        """
        I am having some major difficulty with the two drivers... what I need
        to do is write a for loop that adds the dummy datasets for each
        separate browser. I could make it with an if statement. I could write
        if self.browser is chrome then the data are this, and if self.browser
        is firefox then the data are that, sort of hacky though.
        Red Green Refactor

        No, that doesn't work.
        Maybe if I set them up as a dictionary, with chrome and firefox as the
        keys, and the browsers and data being the values.
        """

        self.firefox = webdriver.Firefox()
        self.chrome = webdriver.Chrome()
        self.browsers = [self.firefox, self.chrome]
        self.dummy_dataset = Dataset.objects.create(title='dummy dataset',
                                 author='dummy_author',
                                 description='dummy dataset description',
                                 url='https://raw.githubusercontent.com/' +
                                 'zmtdummy/GeoJsonData/master/bienvenidos.json')

        self.dummy_kml_dataset = Dataset.objects.create(
                                 author="KML_Test",
                                 title="KML Test Dataset",
                                 description="This is a KML test dataset",
                                 url="https://raw.githubusercontent.com/zmtdummy/"
                                     + "GeoJsonData/master/westcampus.kml")
        """
        self.dummy_dataset_password = Dataset.objects.create(title='dummy dataset with password',
                                 author='dummy_author',
                                 description='dummy dataset description, this' +
                                     'one is password protected',
                                 url='https://raw.githubusercontent.com/' +
                                 'zmtdummy/GeoJsonData/master/bienvenidos.json')
        """


    @classmethod
    def tearDown(self):
        for browser in self.browsers:
            browser.quit()

class BaseLiveTest(StaticLiveServerTestCase):
    """
    In the setUp we will also create a dummy dataset to be manipulated.
    """

    @classmethod
    def setUp(self):
        """
        I am having some major difficulty with the two drivers... what I need
        to do is write a for loop that adds the dummy datasets for each
        separate browser. I could make it with an if statement. I could write
        if self.browser is chrome then the data are this, and if self.browser
        is firefox then the data are that, sort of hacky though.
        Red Green Refactor

        No, that doesn't work.
        Maybe if I set them up as a dictionary, with chrome and firefox as the
        keys, and the browsers and data being the values.
        """
        self.browser= webdriver.Chrome()
        self.dummy_dataset = Dataset.objects.create(title='dummy dataset',
                                 author='dummy_author',
                                 description='dummy dataset description',
                                 url='https://raw.githubusercontent.com/' +
                                 'zmtdummy/GeoJsonData/master/bienvenidos.json')

        self.dummy_kml_dataset = Dataset.objects.create(
                                 author="KML_Test",
                                 title="KML Test Dataset",
                                 description="This is a KML test dataset",
                                 url="https://raw.githubusercontent.com/zmtdummy/"
                                     + "GeoJsonData/master/westcampus.kml")
        """
        self.dummy_dataset_password = Dataset.objects.create(title='dummy dataset with password',
                                 author='dummy_author',
                                 description='dummy dataset description, this' +
                                     'one is password protected',
                                 url='https://raw.githubusercontent.com/' +
                                 'zmtdummy/GeoJsonData/master/bienvenidos.json')
        """


    @classmethod
    def tearDown(self):
        self.browser.quit()
