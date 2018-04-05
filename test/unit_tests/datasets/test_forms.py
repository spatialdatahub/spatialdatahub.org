from django.test import TestCase

from datasets.forms import DatasetCreateForm


class DatasetFormTest(TestCase):

    def test_DatasetForm_validation_for_blank_items(self):
        form = DatasetCreateForm(data={'title': '', 'author': ''})
        self.assertFalse(form.is_valid())
        self.assertEqual(
            form.errors['title'],
            ["This field is required."])
        self.assertEqual(
            form.errors['author'],
            ["This field is required."])
        self.assertEqual(
            form.errors['description'],
            ["This field is required."])

    # there should be more tests for the other forms
    # dataset update form
    # dataset update authentication form
