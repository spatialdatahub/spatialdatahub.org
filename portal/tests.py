from django.core.urlresolvers import resolve
from django.test import Client, TestCase

from datasets.models import Dataset
from datasets.tests import DataSetModelTests
from portal.views import index

client = Client()

class BaseUrlViewTests(TestCase):
    """
    This class will test that (1) the root url resolves to the correct
    view, (2) that the title on the view is correct, (3) that the correct
    variables are brought into the view and displayed, and more.
    """


    # 1
    def test_base_url_resolves_to_home_page(self):
        found = resolve('/')
        response = client.get('/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(found.func, index)

    # 2
    def test_view_title_is_correct(self):
       pass

    # 3
    def test_that_view_can_bring_in_variables_and_display_them(self):

        # Use the set up from the tests file in the datasets app
        DataSetModelTests.setUp(self)

        print(self.ds1.author)
        print(self.ds2.author)
        print(self.ds3.author)
        print(self.ds4.author)

        # GET the index view
        response = client.get('/')

        # GET specific property of the specific variable in view 
        r2 = response.context[1]['id']

        # check to see that the expected value is returned
        print(r2)
        self.assertEqual(r2.json()['id'], 'mapbox.o11ipb8h')


