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
        Dataset.objects.create(author="pat",
                               title="test dataset",
                               description="this is a test dataset",
                               url="https://duckduckgo.com/")
        test_dataset = Dataset.objects.get(title="test dataset")
        self.assertEqual(test_dataset.author, "pat")

    def test_get_absolute_url_returns_correct_url(self):
        expected_url = "/{slug}-{pk}/".format(slug=self.ds1.slug,
                                                pk=self.ds1.pk)
        self.assertEqual(self.ds1.get_absolute_url(), expected_url)
