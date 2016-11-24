from django.core.urlresolvers import reverse
from django.http import HttpRequest
from django.test import TestCase

from accounts.models import Account

from datasets.forms import DatasetForm
from datasets.models import Dataset
from datasets.views import new_dataset


class NewDatasetViewTests(TestCase):

    def setUp(self):
        self.a1 = Account.objects.create(user="test_user",
            affiliation="Zentrum für Marine Tropenökologie")

    def test_new_dataset_view_url_resolves(self):
        response = self.client.get("/test_user/new_dataset/")
        self.assertEqual(response.status_code, 200)

    def test_new_dataset_function_resolves(self):
        request = HttpRequest()
        response = new_dataset(request, account_slug=self.a1.account_slug)
        self.assertEqual(response.status_code, 200)

    def test_new_dataset_view_uses_correct_templates(self):
        response = self.client.get(reverse("datasets:new_dataset",
            kwargs={"account_slug": self.a1.account_slug}))
        self.assertTemplateUsed(response,
            template_name="datasets/new_dataset.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_new_dataset_view_title_is_correct(self):
        response = self.client.get(reverse("datasets:new_dataset",
            kwargs={"account_slug": self.a1.account_slug}))
        self.assertIn("<title>ZMT | New Dataset</title>",
            response.content.decode("utf-8"))

    def test_new_dataset_view_uses_DatasetForm(self):
        response = self.client.get(reverse("datasets:new_dataset",
            kwargs={"account_slug": self.a1.account_slug}))
        self.assertIsInstance(response.context["form"], DatasetForm)

    def test_new_dataset_view_redirects_to_account_detail_view_on_save(self):
        response = self.client.post(reverse("datasets:new_dataset",
            kwargs={"account_slug": self.a1.account_slug}),
            data={"author": "pat", "title": "test dataset",
                "description": "This is a test dataset",
                "url": "https://duckduckgo.com/"})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response["location"], "/test_user/")


class DatasetRemoveViewTests(TestCase):

    def setUp(self):
        self.a1 = Account.objects.create(user='test_user',
            affiliation='Zentrum für Marine Tropenökologie')

        self.ds1 = Dataset.objects.create(account=self.a1,
                                    author="Google",
                                    title="Google GeoJSON Example",
                                    description="Polygons spelling 'GOOGLE' over Australia",
                                    url="https://storage.googleapis.com/maps-devrel/google.json",
                                    public_access=True)

    def test_dataset_remove_view_url_resolves(self):
        response = self.client.get("/test_user/google-geojson-example/1/remove/")
        self.assertEqual(response.status_code, 200)

    def test_dataset_remove_view_uses_correct_templates(self):
        response = self.client.get(reverse("datasets:dataset_remove",
            kwargs={"account_slug": self.a1.account_slug,
            "dataset_slug": self.ds1.dataset_slug, "pk": self.ds1.pk}))
        self.assertTemplateUsed(response,
            template_name="datasets/dataset_remove.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

#    def test_dataset_remove_view_title_is_correct(self):
#        response = self.client.get(reverse("datasets:dataset_remove",
#            kwargs={"account_slug": self.a1.account_slug,
#            "dataset_slug": self.ds1.dataset_slug, "pk": self.ds1.pk}))
#        self.assertIn("<title>ZMT | Remove Dataset</title>",
#            response.content.decode("utf-8"))

#    def test_dataset_remove_view_redirects_to_account_detail_view_on_save(self):
#        response = self.client.post(reverse("datasets:dataset_remove",
#            kwargs={"account_slug": self.a1.account_slug}),
#            data={"author": "pat", "title": "test dataset",
#                "description": "This is a test dataset",
#                "url": "https://duckduckgo.com/"})
#        self.assertEqual(response.status_code, 302)
#        self.assertEqual(response["location"], "/test_user/")

