from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import IntegrityError
from django.test import TestCase

from datasets.models import Dataset
from accounts.models import Account


class DatasetModelTests(TestCase):
    """
    I am attempting to thest the dataset model in isolation. To do this I think
    I may need to drop the base test case I am inhereting from
    """

    def setUp(self):
        self.a1 = Account.objects.create(user='test_user',
            affiliation='Zentrum für Marine Tropenökologie')

        self.ds1 = Dataset.objects.create(account=self.a1,
                                    author="Google",
                                    title="Google GeoJSON Example",
                                    description="Polygons spelling 'GOOGLE' over Australia",
                                    url="https://storage.googleapis.com/maps-devrel/google.json",
                                    public_access=True)


    def test_that_dataset_object_can_be_saved_to_database_and_found(self):
        test_dataset = Dataset.objects.get(dataset_slug="google-geojson-example")
        self.assertEqual(test_dataset.author, "Google")
        self.assertEqual(test_dataset.title, "Google GeoJSON Example")
        self.assertEqual(test_dataset.description,
            "Polygons spelling 'GOOGLE' over Australia")
        self.assertEqual(test_dataset.url,
            "https://storage.googleapis.com/maps-devrel/google.json")
        self.assertEqual(test_dataset.account.user, "test_user")
        self.assertEqual(test_dataset.account.affiliation,
            "Zentrum für Marine Tropenökologie")
        self.assertEqual(test_dataset.account.account_slug, "test_user")


    def test_that_account_and_title_fields_must_be_unique_together(self):
        with self.assertRaises(IntegrityError):
            Dataset.objects.create(account=self.a1,
                                   author="Google",
                                   title="Google GeoJSON Example",
                                   description="Polygons spelling 'GOOGLE' over Australia",
                                   url="https://storage.googleapis.com/maps-devrel/google.json",
                                   public_access=True)


    def test_get_absolute_url_returns_correct_url(self):
        expected_url =  "/{account_slug}/{dataset_slug}/{pk}/".format(
            account_slug=self.a1.account_slug,
            dataset_slug=self.ds1.dataset_slug,
            pk=self.ds1.pk)
        self.assertEqual(self.ds1.get_absolute_url(), expected_url)


    def test_that_when_dataset_is_deleted_the_account_is_still_there(self):
        """
        Because I know what the test_dataset's account is, I don't need to check
        that it is equal to what I know it is; as in the below would be
        unnecessary.

        test_account = Account.objects.get(account_slug="test_user")
        test_dataset = Dataset.objects.get(dataset_slug="google-geojson-example")
        self.assertEqual(test_dataset.account, test_account)
        """
        test_dataset = Dataset.objects.get(dataset_slug="google-geojson-example")
        test_dataset.delete()
        with self.assertRaises(ObjectDoesNotExist):
            Dataset.objects.get(dataset_slug="google-geojson-example")
        Account.objects.get(account_slug="test_user")


    def test_that_when_account_is_deleted_the_dataset_is_also_deleted(self):
        test_account = Account.objects.get(account_slug="test_user")
        test_account.delete()
        with self.assertRaises(ObjectDoesNotExist):
            Dataset.objects.get(dataset_slug="google-geojson-example")
