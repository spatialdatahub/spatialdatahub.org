from django.contrib.auth import get_user_model
from django.urls import reverse
from django.http import HttpRequest
from django.test import Client
from django.test import TestCase

from accounts.models import Account

from datasets.forms import DatasetCreateForm
from datasets.forms import DatasetUpdateForm

from datasets.models import Dataset

from datasets.views import new_dataset
from datasets.views import dataset_detail
from datasets.views import dataset_update
from datasets.views import dataset_update_auth
from datasets.views import dataset_remove
from datasets.views import embed_dataset

from cryptography.fernet import Fernet

import json
import os

User = get_user_model()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# add keyword and remove keyword view tests are missing


class NewDatasetViewTests(TestCase):

    def setUp(self):

        # this should have two users set up
        self.u1 = User.objects.create_user(
            username="test_user", password="test_password")

        self.a1 = self.u1.account
        self.a1.affiliation = "Zentrum für Marine Tropenökologie"
        self.a1.save()

        # pretty much login u1
        self.logged_in = Client()
        self.logged_in.login(username="test_user", password="test_password")
        self.logged_in.is_authenticated = True
        self.logged_in.id = self.u1.id

        # make non logged in client
        self.not_logged_in = Client()

    def test_new_dataset_view_url_requires_password_username(self):
        response = self.not_logged_in.get("/test_user/new_dataset/")
        self.assertEqual(response.status_code, 302)

    def test_new_dataset_view_url_resolves(self):
        response = self.logged_in.get("/test_user/new_dataset/")
        self.assertEqual(response.status_code, 200)

    def test_new_dataset_view_title_is_correct(self):
        response = self.logged_in.get(
            reverse(
                "datasets:new_dataset",
                kwargs={"account_slug": self.a1.account_slug}))
        self.assertIn("<title>ZMT | New Dataset</title>",
                      response.content.decode("utf-8"))

    def test_new_dataset_view_uses_DatasetForm(self):
        response = self.logged_in.get(
            reverse(
                "datasets:new_dataset",
                kwargs={"account_slug": self.a1.account_slug}))
        self.assertIsInstance(response.context["form"], DatasetCreateForm)

    def test_new_dataset_view_redirects_to_dataset_detail_view_on_save(self):
        response = self.logged_in.post(
            reverse(
                "datasets:new_dataset",
                kwargs={"account_slug": self.a1.account_slug}),
            data={"author": "pat", "title": "test dataset",
                  "description": "This is a test dataset",
                  "url": "https://duckduckgo.com/"})

        last_pk = Dataset.objects.all().order_by("-pk")[0].pk

        self.assertEqual(response.status_code, 302)
        self.assertEqual(response["location"],
                         "/test_user/{slug}/".format(slug="test-dataset")) # I need to make this number relative

    def test_new_dataset_view_saves_new_dataset(self):
        self.logged_in.post(
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
        self.u1 = User.objects.create_user(
            username="test_user", password="test_password")

        self.a1 = self.u1.account
        self.a1.affiliation = "Zentrum für Marine Tropenökologie"
        self.a1.save()

        # pretty much login u1
        self.logged_in = Client()
        self.logged_in.login(username="test_user", password="test_password")
        self.logged_in.is_authenticated = True
        self.logged_in.id = self.u1.id

        # make non logged in client
        self.not_logged_in = Client()

        self.ds1 = Dataset.objects.create(
            account=self.a1,
            author="Google",
            title="Google GeoJSON Example",
            description="Polygons spelling 'GOOGLE' over Australia",
            url="https://storage.googleapis.com/maps-devrel/google.json",
            public_access=True)

        self.ds2 = Dataset.objects.create(
            account=self.a1,
            author="ZMT Dummy",
            title="Password Protected Dataset",
            description="I don't remember what this dataset looks like",
            url="https://bitbucket.org/zmtdummy/geojsondata/raw/" +
                "ad675d6fd6e2256b365e79e785603c2ab454006b/" +
                "password_protected_dataset.json",
            dataset_user="zmtdummy",
            dataset_password="zmtBremen1991",
            public_access=True)

    def test_dataset_detail_view_url_resolves(self):
        response = self.not_logged_in.get(
            "/test_user/google-geojson-example/")
        self.assertEqual(response.status_code, 200)

    def test_dataset_detail_view_title_is_correct(self):
        response = self.not_logged_in.get(
            reverse(
                "datasets:dataset_detail",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug}))
        self.assertIn("<title>ZMT | Google GeoJSON Example</title>",
                      response.content.decode("utf-8"))

    def test_that_dataset_detail_view_brings_in_correct_dataset_object(self):
        response = self.not_logged_in.get(
            reverse(
                "datasets:dataset_detail",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug}))
        self.assertEqual(self.ds1, response.context["dataset"])
        self.assertEqual(self.a1, response.context["account"])

    # I do not particularly like these two tests,
    # but i want to make sure that the
    # authentication details do not show up in the detail view
    def test_dataset_detail_view_does_not_show_the_dataset_password(self):
        response = self.not_logged_in.get(
            reverse(
                "datasets:dataset_detail",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds2.dataset_slug}))
        self.assertNotIn(self.ds2.dataset_password,
                         response.context)
        self.assertNotIn("dataset_password",
                         response.content.decode("utf-8"))

    def test_dataset_detail_view_does_not_show_the_dataset_username(self):
        response = self.not_logged_in.get(
            reverse(
                "datasets:dataset_detail",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds2.dataset_slug}))
        self.assertNotIn(self.ds2.dataset_user,
                         response.context)
        self.assertNotIn("dataset_user",
                         response.content.decode("utf-8"))

class EmbeddableDatasetViewTests(TestCase):

    def setUp(self):
        self.u1 = User.objects.create_user(
            username="test_user", password="test_password")

        self.a1 = self.u1.account
        self.a1.affiliation = "Zentrum für Marine Tropenökologie"
        self.a1.save()

        self.u2 = User.objects.create_user(
            username="user_two", password="password_two")

        self.a2 = self.u2.account
        self.a2.affiliation = "Zentrum für Marine Tropenökologie"
        self.a2.save()

        # pretty much login u1
        self.logged_in = Client()
        self.logged_in.login(username="test_user", password="test_password")
        self.logged_in.is_authenticated = True
        self.logged_in.id = self.u1.id

        # make non logged in client
        self.not_logged_in = Client()

        self.ds1 = Dataset.objects.create(
            account=self.a1,
            author="Google",
            title="Google GeoJSON Example",
            description="Polygons spelling 'GOOGLE' over Australia",
            url="https://storage.googleapis.com/maps-devrel/google.json",
            public_access=True)

    def test_embeddable_dataset_view_url_resolves(self):
        response = self.not_logged_in.get(
            "/test_user/google-geojson-example/embed/")
        self.assertEqual(response.status_code, 200)

    def test_embeddable_dataset_view_has_open_Access_Control_Allow_Origin(self):
        response = self.not_logged_in.get(
            "/test_user/google-geojson-example/embed/")
        self.assertEqual(response["Access-Control-Allow-Origin"], "*")

    def test_embeddable_dataset_view_has_right_Access_Control_Allow_Methods(self):
        response = self.not_logged_in.get(
            "/test_user/google-geojson-example/embed/")
        self.assertEqual(response["Access-Control-Allow-Methods"], "GET, OPTIONS")

    def test_embeddable_dataset_view_has_correct_Access_Control_Max_Age(self):
        response = self.not_logged_in.get(
            "/test_user/google-geojson-example/embed/")
        # 43200 is apparently 12 hours
        self.assertEqual(response["Access-Control-Max-Age"], "43200")

    def test_embeddable_dataset_view_has_correct_Access_Control_Allow_Headers(self):
        response = self.not_logged_in.get(
            "/test_user/google-geojson-example/embed/")
        self.assertEqual(response["Access-Control-Allow-Headers"], "X-Requested-With, Content-Type")  

    def test_embeddable_dataset_view_has_correct_Access_Control_Allow_Headers(self):
        response = self.not_logged_in.get(
            "/test_user/google-geojson-example/embed/")
        self.assertEqual(response["X-Frame-Options"], "ALLOW-FROM https://s3.eu-central-1.amazonaws.com/spatialdatahub-embed-test/")  


class DatasetUpdateViewTests(TestCase):

    def setUp(self):
        self.u1 = User.objects.create_user(
            username="test_user", password="test_password")

        self.a1 = self.u1.account
        self.a1.affiliation = "Zentrum für Marine Tropenökologie"
        self.a1.save()

        self.u2 = User.objects.create_user(
            username="user_two", password="password_two")

        self.a2 = self.u2.account
        self.a2.affiliation = "Zentrum für Marine Tropenökologie"
        self.a2.save()

        # pretty much login u1
        self.logged_in = Client()
        self.logged_in.login(username="test_user", password="test_password")
        self.logged_in.is_authenticated = True
        self.logged_in.id = self.u1.id

        # make non logged in client
        self.not_logged_in = Client()

        self.ds1 = Dataset.objects.create(
            account=self.a1,
            author="Google",
            title="Google GeoJSON Example",
            description="Polygons spelling 'GOOGLE' over Australia",
            url="https://storage.googleapis.com/maps-devrel/google.json",
            public_access=True)

        self.ds2 = Dataset.objects.create(
            account=self.a1,
            author="ZMT Dummy",
            title="Password Protected Dataset",
            description="I don't remember what this dataset looks like",
            url="https://bitbucket.org/zmtdummy/geojsondata/raw/" +
                "ad675d6fd6e2256b365e79e785603c2ab454006b/" +
                "password_protected_dataset.json",
            dataset_user="zmtdummy",
            dataset_password="zmtBremen1991",
            public_access=True)

        self.ds3 = Dataset.objects.create(
            account=self.a2,
            author="somebody",
            title="whatever",
            description="yeah",
            url="https://storage.googleapis.com/maps-devrel/google.json",
            public_access=True)

    def test_dataset_update_view_url_requires_logged_in_user(self):
        response = self.not_logged_in.get(
            "/test_user/google-geojson-example/update/")
        self.assertEqual(response.status_code, 302)

    def test_dataset_update_view_url_resolves_for_logged_in_user(self):
        response = self.logged_in.get(
            "/test_user/google-geojson-example/update/")
        self.assertEqual(response.status_code, 200)

    def test_dataset_update_view_url_does_not_resolve_for_incorrect_user(self):
        response = self.logged_in.get(
            "/user_two/whatever/update/")
        self.assertEqual(response.status_code, 302)

    def test_dataset_update_view_title_is_correct(self):
        response = self.logged_in.get(
            reverse(
                "datasets:dataset_update",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug}))
        self.assertIn("<title>ZMT | Update {title}</title>".format(
            title=self.ds1.title),
            response.content.decode("utf-8"))

    def test_dataset_update_view_redirects_dataset_detail_view_on_save(self):
        response = self.logged_in.post(
            reverse(
                "datasets:dataset_update",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug}),
            data={"author": "pat", "title": "test dataset",
                  "description": "This is a test dataset",
                  "url": "https://duckduckgo.com/"})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response["location"],
                         "/test_user/test-dataset/")

    def test_dataset_update_view_updates_dataset(self):
        self.logged_in.post(
            reverse(
                "datasets:dataset_update",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug}),
            data={"author": "pat", "title": "test dataset",
                  "description": "This is a test dataset",
                  "url": "https://duckduckgo.com/"}, follow=True)
        test_dataset = Dataset.objects.get(title="test dataset")
        self.assertEqual(test_dataset.description, "This is a test dataset")

    def test_dataset_update_view_updates_dataset_but_not_auth_pswd(self):
        self.logged_in.post(
            reverse(
                "datasets:dataset_update",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds2.dataset_slug}),
            data={"author": "pat", "title": "test dataset",
                  "description": "This is a test dataset",
                  "url": "https://duckduckgo.com/"}, follow=True)

        CRYPTO_KEY = os.environ.get("CRYPTO_KEY")
        cipher_start = Fernet(CRYPTO_KEY)

        test_dataset = Dataset.objects.get(title="test dataset")
        bytes_password = test_dataset.dataset_password.encode("utf-8")
        decrypted_password = cipher_start.decrypt(bytes_password).decode("utf-8")

        self.assertEqual(decrypted_password, "zmtBremen1991")

    def test_dataset_update_view_updates_dataset_but_not_auth_user(self):
        self.logged_in.post(
            reverse(
                "datasets:dataset_update",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds2.dataset_slug}),
            data={"author": "pat", "title": "test dataset",
                  "description": "This is a test dataset",
                  "url": "https://duckduckgo.com/"}, follow=True)

        CRYPTO_KEY = os.environ.get("CRYPTO_KEY")
        
        cipher_start = Fernet(CRYPTO_KEY)

        test_dataset = Dataset.objects.get(title="test dataset")
        bytes_user = test_dataset.dataset_user.encode("utf-8")
        decrypted_user = cipher_start.decrypt(bytes_user).decode("utf-8")

        self.assertEqual(decrypted_user, "zmtdummy")

'''

class DatasetUpdateAuthViewTests(TestCase):
    """
    I have to make sure that the dataset user and dataset passwords are saved
    and encrypted on save...
    """

    def setUp(self):
        self.a1 = Account.objects.create(
            user="test_user",
            affiliation="Zentrum für Marine Tropenökologie")

        self.ds2 = Dataset.objects.create(
            account=self.a1,
            author="ZMT Dummy",
            title="Password Protected Dataset",
            description="I don't remember what this dataset looks like",
            url="https://bitbucket.org/zmtdummy/geojsondata/raw/" +
                "ad675d6fd6e2256b365e79e785603c2ab454006b/" +
                "password_protected_dataset.json",
            dataset_user="zmtdummy",
            dataset_password="zmtBremen1991",
            public_access=True)

    def test_dataset_update_auth_view_url_resolves(self):
        response = self.client.get(
            "/test_user/password-protected-dataset/{pk}/update/auth/".format(
                pk=self.ds2.pk))
        self.assertEqual(response.status_code, 200)

    def test_dataset_update_auth_view_title_is_correct(self):
        response = self.client.get(
            reverse(
                "datasets:dataset_update_auth",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds2.dataset_slug,
                        "pk": self.ds2.pk}))
        self.assertIn("<title>ZMT | Update {title}</title>".format(
            title=self.ds2.title),
            response.content.decode("utf-8"))

    # These next two tests are not updating on client.post
    def test_dataset_update_auth_redirects_dataset_detail_on_save(self):
        response = self.client.post(
            reverse(
                "datasets:dataset_update_auth",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds2.dataset_slug,
                        "pk": self.ds2.pk}),
            data={"dataset_user": "differentUser",
                  "dataset_password": "differentPassword"})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response["location"],
                         "/test_user/password-protected-dataset/{pk}/".format(
                         pk=self.ds2.pk))
'''

class DatasetRemoveViewTests(TestCase):

    def setUp(self):
        self.u1 = User.objects.create_user(
            username="test_user", password="test_password")

        self.a1 = self.u1.account
        self.a1.affiliation = "Zentrum für Marine Tropenökologie"
        self.a1.save()

        self.ds1 = Dataset.objects.create(
            account=self.a1,
            author="Google",
            title="Google GeoJSON Example",
            description="Polygons spelling 'GOOGLE' over Australia",
            url="https://storage.googleapis.com/maps-devrel/google.json",
            public_access=True)

        # pretty much login u1
        self.logged_in = Client()
        self.logged_in.login(username="test_user", password="test_password")
        self.logged_in.is_authenticated = True
        self.logged_in.id = self.u1.id

        # make non logged in client
        self.not_logged_in = Client()

    def test_dataset_remove_view_url_does_not_resolve_for_non_logged_in_users(self):
        response = self.not_logged_in.get(
            "/test_user/google-geojson-example/remove/")
        self.assertEqual(response.status_code, 302)

    def test_dataset_remove_view_url_resolves(self):
        response = self.logged_in.get(
            "/test_user/google-geojson-example/remove/")
        self.assertEqual(response.status_code, 200)

    def test_dataset_remove_view_title_is_correct(self):
        response = self.logged_in.get(
            reverse(
                "datasets:dataset_remove",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug}))
        self.assertIn("<title>ZMT | Remove Dataset</title>",
                      response.content.decode("utf-8"))

    def test_dataset_remove_view_redirects_account_detail_view_on_save(self):
        response = self.logged_in.post(
            reverse(
                "datasets:dataset_remove",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug}),
                follow=False)
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response["location"], "/test_user/")

    def test_that_dataset_remove_view_removes_datasets(self):
        self.logged_in.post(
            reverse(
                "datasets:dataset_remove",
                kwargs={"account_slug": self.a1.account_slug,
                        "dataset_slug": self.ds1.dataset_slug}),
            follow=True)
        self.assertFalse(Dataset.objects.all())
