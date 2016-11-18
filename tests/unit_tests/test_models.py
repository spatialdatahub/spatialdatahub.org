from django.test import TestCase
from datasets.models import Dataset
from .base import BaseDatasetTest


class DatasetModelTests(BaseDatasetTest):
    """
    This is the refactored version of the DatasetModelTests test class
    """

    def test_that_dataset_model_has_objects_already(self):
        dataset_list = Dataset.objects.all()
        self.assertEqual(dataset_list.count(), 3)

    def test_that_dataset_object_can_be_saved_to_database_and_found(self):
        Dataset.objects.create(account=self.a1,
                               author="pat",
                               title="test dataset",
                               description="this is a test dataset",
                               url="https://duckduckgo.com/")
        test_dataset = Dataset.objects.get(title="test dataset")

        # should these assertions be separated into stand alone tests?
        self.assertEqual(test_dataset.author, "pat")
        self.assertEqual(test_dataset.title, "test dataset")
        self.assertEqual(test_dataset.description, "this is a test dataset")
        self.assertEqual(test_dataset.url, "https://duckduckgo.com/")
        self.assertEqual(test_dataset.account.user, "test_user")
        self.assertEqual(test_dataset.account.affiliation, "zmt")
        self.assertEqual(test_dataset.account.account_slug, "test_user")

    def test_get_absolute_url_returns_correct_url(self):
        expected_url =  "/{account_slug}/{dataset_slug}/{pk}/".format(
            account_slug=self.a1.account_slug,
            dataset_slug=self.ds1.dataset_slug,
            pk=self.ds1.pk)
        self.assertEqual(self.ds1.get_absolute_url(), expected_url)
