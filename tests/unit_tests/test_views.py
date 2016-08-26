from django.core.urlresolvers import reverse
from django.utils.text import slugify

from datasets.models import Dataset
from .base import BaseDatasetTest

from datasets.views import PortalView, AboutView, ContactView, DatasetCreateView
from datasets.views import DatasetDetailView, DatasetUpdateView, DatasetRemoveView


class UrlsAndViewsTests(BaseDatasetTest):
    """
    This class will test that all the different urls return a status code of
    200

    RequestFactory doesn't seem to need a specific url for the Class Based
    Views, it seems to be only generating a request, and no matter what that
    request is, if it is passed to the cClass based view, the view will work

    These tests are set up to deal with the change to Class Based Views
    """

    def test_base_url_resolves_to_PortalView(self):
        request = self.factory.get('')
        response = PortalView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_about_url_resolves_to_AboutView(self):
        request = self.factory.get('')
        response = AboutView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_contact_url_resolves_to_ContactView(self):
        request = self.factory.get('')
        response = ContactView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_dataset_create_url_resolves_to_DatasetCreateView(self):
        request = self.factory.get('')
        response = DatasetCreateView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_dataset_detail_url_resolves_to_DatasetDetailView(self):
        request = self.factory.get('')
        response = DatasetDetailView.as_view()(request,
                                               slug=self.ds1.slug,
                                               pk=self.ds1.pk)
        self.assertEqual(response.status_code, 200)

    def test_dataset_update_url_resolves_to_DatasetUpdateView(self):
        request = self.factory.get('')
        response = DatasetUpdateView.as_view()(request,
                                               slug=self.ds1.slug,
                                               pk=self.ds1.pk)
        self.assertEqual(response.status_code, 200)

    def test_dataset_remove_url_resolves_to_DatasetRemoveView(self):
        request = self.factory.get('')
        response = DatasetRemoveView.as_view()(request,
                                               slug=self.ds1.slug,
                                               pk=self.ds1.pk)
        self.assertEqual(response.status_code, 200)

class ViewTemplateTests(BaseDatasetTest):

    def test_PortalView_uses_correct_template(self):
        response = self.client.get('/')
        self.assertTemplateUsed(response,
            template_name="datasets/portal.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_AboutView_uses_correct_template(self):
        response = self.client.get('/about/')
        self.assertTemplateUsed(response,
            template_name="datasets/about.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_ContactView_uses_correct_template(self):
        response = self.client.get('/contact/')
        self.assertTemplateUsed(response,
            template_name="datasets/contact.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_DatasetCreateView_uses_correct_template(self):
        response = self.client.get('/new_dataset/')
        self.assertTemplateUsed(response,
            template_name="datasets/dataset_create.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_DatasetDetailView_uses_correct_template(self):
        test_url = '/{slug}-{pk}/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(test_url)
        self.assertTemplateUsed(response,
            template_name="datasets/dataset_detail.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_DatasetUpdateView_uses_correct_template(self):
        test_url = '/{slug}-{pk}/update/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(test_url)
        self.assertTemplateUsed(response, template_name="datasets/dataset_update.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_DatasetRemoveView_uses_correct_template(self):
        test_url = '/{slug}-{pk}/remove/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(test_url)
        self.assertTemplateUsed(response,
            template_name="datasets/dataset_confirm_remove.html")
        self.assertTemplateUsed(response,
            template_name="base.html")


class ViewTitleTests(BaseDatasetTest):

    def test_PortalView_title_is_correct(self):
        response = self.client.get('/')
        self.assertIn('<title>ZMT | GIS Portal</title>', response.content.decode('utf-8'))

    def test_about_url_title_is_correct(self):
        response = self.client.get('/about/')
        self.assertIn('<title>ZMT | About</title>', response.content.decode('utf-8'))

    def test_contact_url_title_is_correct(self):
        response = self.client.get('/contact/')
        self.assertIn('<title>ZMT | Contact</title>', response.content.decode('utf-8'))

    def test_dataset_create_url_title_is_correct(self):
        response = self.client.get('/new_dataset/')
        self.assertIn('<title>ZMT | New Dataset</title>', response.content.decode('utf-8'))

    def test_dataset_detail_url_title_is_correct(self):
        test_url = '/{slug}-{pk}/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(test_url)
        self.assertIn('<title>ZMT | %s</title>' % self.ds1.title, response.content.decode('utf-8'))

    def test_dataset_update_url_title_is_correct(self):
        test_url = '/{slug}-{pk}/update/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(test_url)
        self.assertIn('<title>ZMT | Update %s</title>' % self.ds1.title, response.content.decode('utf-8'))

    def test_dataset_remove_url_title_is_correct(self):
        test_url = '/{slug}-{pk}/remove/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(test_url)
        self.assertIn('<title>ZMT | Remove Dataset</title>', response.content.decode('utf-8'))


class ViewContextTests(BaseDatasetTest):
    """
    This test checks that each of the views that bring in Dataset objects
    brings in the correct objects. In the case of the PortalView it also checks
    the number of objects that are brought in.
    """

    def test_that_PortalView_brings_in_correct_number_of_dataset_objects(self):
        response = self.client.get('/')
        self.assertEqual(5, len(response.context['dataset_list']))

    def test_that_PortalView_brings_in_correct_list_of_dataset_objects(self):
        response = self.client.get('/')
        object_list = Dataset.objects.all()
        for index, ds in enumerate(object_list):
            self.assertEqual(ds, response.context['dataset_list'][index])

    def test_that_DatasetDetailView_brings_in_correct_dataset_object(self):
        test_url = '/{slug}-{pk}/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(test_url)
        self.assertEqual(self.ds1, response.context['dataset'])
        self.assertNotEqual(self.ds2, response.context['dataset'])

    def test_that_DatasetUpdateView_brings_in_correct_dataset_object(self):
        test_url = '/{slug}-{pk}/update/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(test_url)
        self.assertEqual(self.ds1, response.context['dataset'])
        self.assertNotEqual(self.ds2, response.context['dataset'])

    def test_that_DatasetRemoveView_brings_in_correct_dataset_object(self):
        test_url = '/{slug}-{pk}/remove/'.format(slug=self.ds1.slug, pk=self.ds1.pk)
        response = self.client.get(test_url)
        self.assertEqual(self.ds1, response.context['dataset'])
        self.assertNotEqual(self.ds2, response.context['dataset'])


class PortalViewSearchTest(BaseDatasetTest):
    # 4
    def test_view_search_function(self):
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
        response = self.client.get(url)
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
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, template_name="datasets/dataset_detail.html")

        # make new response object
        response2 = self.client.get(reverse('datasets:dataset_detail',
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


