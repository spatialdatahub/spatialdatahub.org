from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from django.test import TestCase

from datasets.models import Dataset
from accounts.models import Account

from cryptography.fernet import Fernet
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class DatasetModelTests(TestCase):
    """
    I am attempting to thest the dataset model in isolation. To do this I think
    I may need to drop the base test case I am inhereting from
    """

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
           url="https://bitbucket.org/zmtdummy/geojsondata/raw/" +
               "ad675d6fd6e2256b365e79e785603c2ab454006b/" +
               "password_protected_dataset.json",
           dataset_user="zmtdummy",
           dataset_password="zmtBremen1991",
           public_access=False)

    def test_that_dataset_object_can_be_saved_to_database_and_found(self):
        test_dataset = Dataset.objects.get(
            dataset_slug="google-geojson-example")
        self.assertEqual(test_dataset.author, "Google")
        self.assertEqual(test_dataset.title, "Google GeoJSON Example")
        self.assertEqual(test_dataset.description,
                         "Polygons spelling 'GOOGLE' over Australia")
        self.assertEqual(
            test_dataset.url,
            "https://storage.googleapis.com/maps-devrel/google.json")
        self.assertEqual(test_dataset.account.user, "test_user")
        self.assertEqual(test_dataset.account.affiliation,
                         "Zentrum für Marine Tropenökologie")
        self.assertEqual(test_dataset.account.account_slug, "test_user")

    def test_that_account_and_title_fields_must_be_unique_together(self):
        with self.assertRaises(IntegrityError):
            Dataset.objects.create(
                account=self.a1,
                author="Google",
                title="Google GeoJSON Example",
                description="Polygons spelling 'GOOGLE' over Australia",
                url="https://storage.googleapis.com/maps-devrel/google.json",
                public_access=True)

    def test_that_database_object_saves_with_slug(self):
        self.assertEqual(self.ds1.dataset_slug, "google-geojson-example")

    def test_that_database_object_updates_slug_on_save(self):
        self.ds1.title = "Slug Update Test"
        self.ds1.save()
        self.assertEqual(self.ds1.dataset_slug, "slug-update-test")

    def test_that_ext_field_is_saved_correctly(self):
        self.assertEqual(self.ds1.ext, "geojson")

    def test_that_database_object_updates_ext_on_save_kml(self):
        self.ds1.url = "https://storage.googleapis.com/maps-devrel/google.kml"
        self.ds1.save()
        self.assertEqual(self.ds1.ext, "kml")

    def test_that_database_object_updates_ext_on_save_csv(self):
        self.ds1.url = "https://storage.googleapis.com/maps-devrel/google.csv"
        self.ds1.save()
        self.assertEqual(self.ds1.ext, "csv")

    def test_get_absolute_url_returns_correct_url(self):
        expected_url = "/{account_slug}/{dataset_slug}/{pk}/".format(
            account_slug=self.a1.account_slug,
            dataset_slug=self.ds1.dataset_slug,
            pk=self.ds1.pk)
        self.assertEqual(self.ds1.get_absolute_url(), expected_url)

    def test_that_when_dataset_is_deleted_the_account_is_still_there(self):
        """
        Because I know what the test_dataset's account is,
        I don't need to check
        that it is equal to what I know it is; as in the below would be
        unnecessary.

        test_account = Account.objects.get(account_slug="test_user")
        test_dataset = Dataset.objects.get(
            dataset_slug="google-geojson-example")
        self.assertEqual(test_dataset.account, test_account)
        """
        test_dataset = Dataset.objects.get(
            dataset_slug="google-geojson-example")
        test_dataset.delete()
        with self.assertRaises(ObjectDoesNotExist):
            Dataset.objects.get(dataset_slug="google-geojson-example")
        Account.objects.get(account_slug="test_user")

    def test_that_when_account_is_deleted_the_dataset_is_also_deleted(self):
        test_account = Account.objects.get(account_slug="test_user")
        test_account.delete()
        with self.assertRaises(ObjectDoesNotExist):
            Dataset.objects.get(dataset_slug="google-geojson-example")

    def test_that_PASSWORD_PROTECTED_dataset_password_is_encrypted(self):
        dataset = Dataset.objects.get(
            dataset_slug="password-protected-dataset")
        self.assertNotEqual(dataset.dataset_password, "zmtBremen1991")

    def test_that_PASSWORD_PROTECTED_dataset_user_is_encrypted(self):
        dataset = Dataset.objects.get(
            dataset_slug="password-protected-dataset")
        self.assertNotEqual(dataset.dataset_user, "zmtdummy")

    def test_that_PASSWORD_PROTECTED_dataset_password_can_be_decrypted(self):
        # set base dir
        BASE_DIR = os.path.dirname(os.path.dirname(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        # get key from file
        f = BASE_DIR + "/temp_password.txt"
        g = open(f)
        key = g.read().encode("utf-8")
        g.close()
        cipher_end = Fernet(key)
        dataset = Dataset.objects.get(
            dataset_slug="password-protected-dataset")
        bytes_password = dataset.dataset_password.encode("utf-8")
        decrypted_password = cipher_end.decrypt(bytes_password).decode("utf-8")
        self.assertEqual(decrypted_password, "zmtBremen1991")

    def test_that_PASSWORD_PROTECTED_dataset_user_can_be_decrypted(self):
        # set base dir
        base_dir = os.path.dirname(os.path.dirname(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        # get key from file
        f = base_dir + "/temp_password.txt"
        g = open(f)
        key = g.read().encode("utf-8")
        g.close()
        cipher_end = Fernet(key)
        dataset = Dataset.objects.get(
            dataset_slug="password-protected-dataset")
        bytes_user = dataset.dataset_user.encode("utf-8")
        decrypted_user = cipher_end.decrypt(bytes_user).decode("utf-8")
        self.assertEqual(decrypted_user, "zmtdummy")
