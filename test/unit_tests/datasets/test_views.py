from django.core.urlresolvers import reverse
from django.http import HttpRequest
from django.test import TestCase

from accounts.models import Account

from datasets.forms import DatasetForm
from datasets.models import Dataset
from datasets.views import new_dataset
from datasets.views import dataset_detail
from datasets.views import dataset_update
from datasets.views import dataset_remove


class NewDatasetViewTests(TestCase):

    def setUp(self):
        self.a1 = Account.objects.create(
            user="test_user",
            affiliation="Zentrum für Marine Tropenökologie")

    def test_new_dataset_view_url_resolves(self):
        response = self.client.get("/test_user/new_dataset/")
        self.assertEqual(response.status_code, 200)

    def test_new_dataset_function_resolves(self):
        request = HttpRequest()
        response = new_dataset(request, account_slug=self.a1.account_slug)
        self.assertEqual(response.status_code, 200)

    def test_new_dataset_view_uses_correct_templates(self):
        response = self.client.get(
            reverse(
                "datasets:new_dataset",
                kwargs={"account_slug": self.a1.account_slug}))
        self.assertTemplateUsed(response,
                                template_name="datasets/new_dataset.html")
        self.assertTemplateUsed(response,
                                template_name="base.html")

    def test_new_dataset_view_title_is_correct(self):
        response = self.client.get(
            reverse(
                "datasets:new_dataset",
                kwargs={"account_slug": self.a1.account_slug}))
        self.assertIn("<title>ZMT | New Dataset</title>",
                      response.content.decode("utf-8"))

    def test_new_dataset_view_uses_DatasetForm(self):
        response = self.client.get(
            reverse(
                "datasets:new_dataset",
                kwargs={"account_slug": self.a1.account_slug}))
        self.assertIsInstance(response.context["form"], DatasetForm)

    def test_new_dataset_view_redirects_to_account_detail_view_on_save(self):
        response = self.client.post(
            reverse(
                "datasets:new_dataset",
                kwargs={"account_slug": self.a1.account_slug}),
            data={"author": "pat", "title": "test dataset",
                  "description": "This is a test dataset",
                  "url": "https://duckduckgo.com/"})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response["location"], "/test_user/")

    def test_new_dataset_view_saves_new_dataset(self):
        self.client.post(
            reverse(
                "datasets:new_dataset",
                kwargs={"account_slug": self.a1.account_slug}),
            data={"author": "pat", "title": "test dataset",
                  "description": "This is a test dataset",
                  "url": "https://duckduckgo.com/"}, follow=True)
        test_dataset = Dataset.objects.all()[0]
        self.assertEqual(test_dataset.title, "test dataset")


class DatasetDetailViewTests(TestCase):

    def setUp(self):
        self.a1 = Account.objects.create(
            user="test_user",
            affiliation="Zentrum für Marine Tropenökologie")

        self.ds1 = Dataset.objects.create(
            account=self.a1,
            author="Google",
            title="Google GeoJSON Example",
            description="Polygons spelling 'GOOGLE' over Australia",
            url="https://storage.googleapis.com/maps-devrel/google.json",
            public_access=True)

        self.ds2 = Dataset.objects.create(
            account=self.a1,
            author="zmtdummy",
            title="Password Protected Dataset",
            description="Just a page that requires login and password info",
            url="https://bitbucket.org/zmtdummy/geojsondata",
            public_access=False)

    def test_dataset_detail_view_url_resolves(self):
        response = self.client.get(
            "/test_user/google-geojson-example/{pk}/".format(
                pk=self.ds1.pk))
        self.assertEqual(response.status_code, 200)

    def test_dataset_detail_function_resolves(self):
        request = HttpRequest()
        response = dataset_detail(request,
                                  account_slug=self.a1.account_slug,
                                  dataset_slug=self.ds1.dataset_slug,
                                  pk=self.ds1.pk)
        self.assertEqual(response.status_code, 200)

    def test_dataset_detail_view_uses_correct_templates(self):
        response = self.client.get(
            reverse(
                "datasets:dataset_detail",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug,
                        "pk": self.ds1.pk}))
        self.assertTemplateUsed(response,
                                template_name="datasets/dataset_detail.html")
        self.assertTemplateUsed(response,
                                template_name="base.html")

    def test_dataset_detail_view_title_is_correct(self):
        response = self.client.get(
            reverse(
                "datasets:dataset_detail",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug,
                        "pk": self.ds1.pk}))
        self.assertIn("<title>ZMT | Google GeoJSON Example</title>",
                      response.content.decode("utf-8"))

    def test_that_dataset_detail_view_brings_in_correct_dataset_object(self):
        response = self.client.get(
            reverse(
                "datasets:dataset_detail",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug,
                        "pk": self.ds1.pk}))
        self.assertEqual(self.ds1, response.context["dataset"])
        self.assertEqual(self.a1, response.context["account"])

    # I do not particularly like these two tests,
    # but i want to make sure that the
    # authentication details do not show up in the detail view
    def test_dataset_detail_view_does_not_show_the_dataset_password(self):
        response = self.client.get(
            reverse(
                "datasets:dataset_detail",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds2.dataset_slug,
                        "pk": self.ds2.pk}))
        self.assertNotIn(self.ds2.dataset_password, response.context)
        self.assertNotIn("dataset_password", response.content.decode("utf-8"))

    def test_dataset_detail_view_does_not_show_the_dataset_username(self):
        response = self.client.get(
            reverse(
                "datasets:dataset_detail",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds2.dataset_slug,
                        "pk": self.ds2.pk}))
        self.assertNotIn(self.ds2.dataset_user, response.context)
        self.assertNotIn("dataset_user", response.content.decode("utf-8"))


class DatasetUpdateViewTests(TestCase):

    def setUp(self):
        self.a1 = Account.objects.create(
            user="test_user",
            affiliation="Zentrum für Marine Tropenökologie")

        self.ds1 = Dataset.objects.create(
            account=self.a1,
            author="Google",
            title="Google GeoJSON Example",
            description="Polygons spelling 'GOOGLE' over Australia",
            url="https://storage.googleapis.com/maps-devrel/google.json",
            public_access=True)

    def test_dataset_update_view_url_resolves(self):
        response = self.client.get(
            "/test_user/google-geojson-example/{pk}/update/".format(
                pk=self.ds1.pk))
        self.assertEqual(response.status_code, 200)

    def test_dataset_update_function_resolves(self):
        request = HttpRequest()
        response = dataset_update(request,
                                  account_slug=self.a1.account_slug,
                                  dataset_slug=self.ds1.dataset_slug,
                                  pk=self.ds1.pk)
        self.assertEqual(response.status_code, 200)

    def test_dataset_update_view_uses_correct_templates(self):
        response = self.client.get(
            reverse(
                "datasets:dataset_update",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug,
                        "pk": self.ds1.pk}))
        self.assertTemplateUsed(response,
                                template_name="datasets/dataset_update.html")
        self.assertTemplateUsed(response,
                                template_name="base.html")

    def test_dataset_update_view_title_is_correct(self):
        response = self.client.get(
            reverse(
                "datasets:dataset_update",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug,
                        "pk": self.ds1.pk}))
        self.assertIn("<title>ZMT | Update {title}</title>".format(
            title=self.ds1.title),
            response.content.decode("utf-8"))

    def test_dataset_update_view_redirects_dataset_detail_view_on_save(self):
        response = self.client.post(
            reverse(
                "datasets:dataset_update",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug,
                        "pk": self.ds1.pk}),
            data={"author": "pat", "title": "test dataset",
                  "description": "This is a test dataset",
                  "url": "https://duckduckgo.com/"})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response["location"],
                         "/test_user/test-dataset/{pk}/".format(
                         pk=self.ds1.pk))

    def test_dataset_update_view_updates_dataset(self):
        self.client.post(
            reverse(
                "datasets:dataset_update",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug,
                        "pk": self.ds1.pk}),
            data={"author": "pat", "title": "test dataset",
                  "description": "This is a test dataset",
                  "url": "https://duckduckgo.com/"}, follow=True)
        test_dataset = Dataset.objects.all()[0]
        self.assertEqual(test_dataset.title, "test dataset")


class DatasetRemoveViewTests(TestCase):

    def setUp(self):
        self.a1 = Account.objects.create(
            user="test_user",
            affiliation="Zentrum für Marine Tropenökologie")

        self.ds1 = Dataset.objects.create(
            account=self.a1,
            author="Google",
            title="Google GeoJSON Example",
            description="Polygons spelling 'GOOGLE' over Australia",
            url="https://storage.googleapis.com/maps-devrel/google.json",
            public_access=True)

    def test_dataset_remove_view_url_resolves(self):
        response = self.client.get(
            "/test_user/google-geojson-example/{pk}/remove/".format(
                pk=self.ds1.pk))
        self.assertEqual(response.status_code, 200)

    def test_dataset_remove_function_resolves(self):
        request = HttpRequest()
        response = dataset_remove(
            request,
            account_slug=self.a1.account_slug,
            dataset_slug=self.ds1.dataset_slug,
            pk=self.ds1.pk)
        self.assertEqual(response.status_code, 200)

    def test_dataset_remove_view_uses_correct_templates(self):
        response = self.client.get(
            reverse(
                "datasets:dataset_remove",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug,
                        "pk": self.ds1.pk}))
        self.assertTemplateUsed(response,
                                template_name="datasets/dataset_remove.html")
        self.assertTemplateUsed(response,
                                template_name="base.html")

    def test_dataset_remove_view_title_is_correct(self):
        response = self.client.get(
            reverse(
                "datasets:dataset_remove",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug,
                        "pk": self.ds1.pk}))
        self.assertIn("<title>ZMT | Remove Dataset</title>",
                      response.content.decode("utf-8"))

    def test_dataset_remove_view_redirects_account_detail_view_on_save(self):
        response = self.client.post(
            reverse(
                "datasets:dataset_remove",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug,
                        "pk": self.ds1.pk}),
            data={"author": "pat", "title": "test dataset",
                  "description": "This is a test dataset",
                  "url": "https://duckduckgo.com/"})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response["location"], "/test_user/")

    def test_that_dataset_remove_view_brings_in_correct_dataset_object(self):
        response = self.client.get(
            reverse(
                "datasets:dataset_remove",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug,
                        "pk": self.ds1.pk}))
        self.assertEqual(self.ds1, response.context["dataset"])
        self.assertEqual(self.a1, response.context["account"])

    def test_that_dataset_remove_view_removes_datasets(self):
        self.client.post(
            reverse(
                "datasets:dataset_remove",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug,
                        "pk": self.ds1.pk}),
            follow=True)
        self.assertFalse(Dataset.objects.all())
