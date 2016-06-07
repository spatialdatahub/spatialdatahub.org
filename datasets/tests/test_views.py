from django.core.urlresolvers import resolve
from django.test import Client, TestCase
from django.utils.text import slugify

from datasets.models import Dataset
from .base import BaseDatasetTest
from datasets.views import portal

client = Client()

class RootUrlViewTests(BaseDatasetTest):
    """
    This class will test that (1) the root url resolves to the correct
    view, (2) that the title on the view is correct, (3) that the correct
    variables are brought into the view and displayed. (4) That
    the search function brings up the correct objects.
    """

    # 1
    def test_base_url_resolves_to_home_page(self):
        found = resolve('/')
        response = client.get('/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(found.func, portal)

    # 2
    def test_view_title_is_correct(self):
        response = client.get('/')

        self.assertIn('GIS Portal', response.content.decode('utf-8'))

    # 3
    def test_that_view_can_bring_in_variables_and_display_them(self):

        # Use the set up from the tests file in the datasets app

        # GET the portal view
        response = client.get('/')


        ### THIS PART OF THE TEST MUST BE REFACTORED ###

        # GET specific property of the specific variable in view 
        # r2 = response.context[1]['id']

        # check to see that the expected value is returned
        # print(r2)
        # self.assertEqual(r2.json()['id'], 'mapbox.o11ipb8h')

        ### THIS PART OF THE TEST MUST BE REFACTORED ###

    # 4
    def test_view_search_function(self):

        # Use the set up from the tests file in the datasets app

        # now get the items, check them all
        dataset_list = Dataset.objects.all()
        self.assertEqual(dataset_list[0], self.ds1)
        self.assertEqual(len(dataset_list), 4)

        # then filter them and check
        dataset_list = Dataset.objects.filter(title__contains=('ZMT'))
        self.assertEqual(len(dataset_list), 1)

        # now run it as a get request for "zmt"
        response = client.get('/?q=zmt')
        self.assertEqual(response.status_code, 200)
        self.assertIn('ZMT GeoJSON Polygon', response.content.decode('utf-8'))
        self.assertNotIn('Mapbox GeoJson Example', response.content.decode('utf-8'))


class DatasetMetaDataViewTests(BaseDatasetTest):
    """
    This class will test that (1) the dataset url resolves to the correct
    view, (2) that the title on the view is correct, (3) that the correct
    variables are brought into the view and displayed, and more. (4) Test
    that a dataset that is protectd by a password and username can be called
    and that the username and password are removed before the final stage.
    """

    def test_dataset_detail_url_resolves_correct_page(self):

        # We will use the set up from the datasets test file eventually
        # but first we will use a simple locally defined instance

        # Use the set up from the tests file in the datsets app

        # Call the dataset slug and the dataset pk for the url, which 
        # is defined with the "get_absolute_url" function in the model
        # and is "/<slug>-<pk>/"

        title = "This is my test title"
        dataset_entry = Dataset.objects.create(title=title, author="Test Testerson",
                                               description="This is a test dataset",
                                               url="http://www.google.com")
        slug = slugify(title)
        url = "/{slug}-{pk}/".format(slug=slug, pk=dataset_entry.pk,)

        # 1 -- check that dataset url is correct
        response = client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, template_name="datasets/dataset_detail.html")

        # 2 -- check that page title is correct
        self.assertIn(title, response.content.decode("utf-8"))

        # 3 -- check that correct variables are displayed on page
        self.assertIn(dataset_entry.author, response.content.decode("utf-8"))
        self.assertIn(dataset_entry.url, response.content.decode("utf-8"))
        self.assertIn(dataset_entry.description, response.content.decode("utf-8"))

    # 4
    def test_password_protected_dataset_does_not_have_user_password_in_final_stage(self):
        """
        The view function should be able to use the special username and password,
        remove them from the context variable, and add the json dataset to the
        context variable.
        """
        pass
