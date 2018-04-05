from django.test import TestCase

from datasets.forms import DatasetCreateForm
from datasets.forms import DatasetUpdateForm
from datasets.forms import DatasetUpdateAuthForm


class DatasetFormTest(TestCase):

    def test_DatasetCreateForm_validation_for_blank_items(self):
        form = DatasetCreateForm(data={"title": "", "author": ""})
        self.assertFalse(form.is_valid())
        self.assertEqual(
            form.errors["title"],
            ["This field is required."])
        self.assertEqual(
            form.errors["author"],
            ["This field is required."])
        self.assertEqual(
            form.errors["description"],
            ["This field is required."])

    def test_DatasetUpdateForm_validation_for_blank_items(self):
        form = DatasetUpdateForm(data={"title": "", "author": ""})
        self.assertFalse(form.is_valid())
        self.assertEqual(
            form.errors["title"],
            ["This field is required."])
        self.assertEqual(
            form.errors["author"],
            ["This field is required."])
        self.assertEqual(
            form.errors["description"],
            ["This field is required."])

    def test_DatasetUpdateAuthForm_allows_blank_items(self):
        form = DatasetUpdateAuthForm(data={"dataset_user": "",
                                           "dataset_password": "",
                                           "owncloud_instance": "",
                                           "owncloud_path": ""})
        self.assertTrue(form.is_valid())
