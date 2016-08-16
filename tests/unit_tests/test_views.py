from django.core.urlresolvers import resolve, reverse
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
#        self.assertEqual(len(dataset_list), 4)

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
                                               url="http://www.duckduckgo.com")
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

        title = "Password protected dataset test title"
        dataset_entry = Dataset.objects.create(title=title, author="Secret Test Testerson",
                                               description="This is a test dataset that" +
                                                           "is password protected",
                                               url="https://bitbucket.org/zmtdummy/geojsondata/" +
                                                   "raw/ad675d6fd6e2256b365e79e785603c2ab454006b/" +
                                                   "password_protected_dataset.json",
                                               dataset_user='zmtdummy',
                                               dataset_password='zmtBremen1991')

        slug = slugify(title)
        url = "/{slug}-{pk}/".format(slug=slug, pk=dataset_entry.pk,)

        # check that dataset url is correct
        response = client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, template_name="datasets/dataset_detail.html")

        # make new response object
        response2 = client.get(reverse('datasets:dataset_detail',
                                       kwargs={'slug':slug, 'pk':dataset_entry.pk}))

        # check that page title is correct
        self.assertIn(title, response.content.decode("utf-8"))

        # check that correct variables are displayed on page
        self.assertIn(dataset_entry.author, response.content.decode("utf-8"))
        self.assertIn(dataset_entry.url, response.content.decode("utf-8"))
        self.assertIn(dataset_entry.description, response.content.decode("utf-8"))

        # check that dataset password can be pulled up from dataset object
        self.assertEqual(dataset_entry.dataset_password, 'zmtBremen1991')

        # check that dataset password is not displayed on page
        self.assertNotIn(dataset_entry.dataset_password, response.content.decode("utf-8"))
        self.assertNotIn(dataset_entry.dataset_password, response.context)
        self.assertNotIn(dataset_entry.dataset_password, response2.content.decode("utf-8"))
        self.assertNotIn(dataset_entry.dataset_password, response2.context)

'''
class DatasetKmlViewTests(BaseDatasetTest):
    """
    This is a view that I will incorporate into the portal view, once it works. It
    will check (1) what type of file is being loaded and (2) it will add a field to the
    serialized list that says what type of file it is, which will be used by the template
    language to determine which JavaScript command to use.
    """

    # 1
    def test_file_type(self):

        title1 = "kmz test dataset"
        title2 = "kml test dataset"
        dataset_entry1 = Dataset.objects.create(title=title1, author="Test Testerson",
                                               description="This is a test dataset that" +
                                                           "is password protected",
                                               url="https://github.com/zmtdummy/GeoJsonData/" +
                                                   "raw/master/berlin_craft_beer_locations.kmz")

        dataset_entry2 = Dataset.objects.create(title=title2, author="KML Test Testerson",
                                               description="This is a test kml dataset",
                                               url="https://raw.githubusercontent.com/" +
                                                   "zmtdummy/GeoJsonData/master/westcampus.kml")

        dataset_list = [dataset_entry1, dataset_entry2, self.ds1]

        for dataset in dataset_list:
            if str(dataset.url.lower()).endswith('.json'):
                print("Its name is JSON")
            elif str(dataset.url.lower()).endswith('.kml'):
                print("kml")
            elif str(dataset.url.lower()).endswith('.kmz'):
                print("kmz")
            else:
                print("Totally Unknown")
'''
