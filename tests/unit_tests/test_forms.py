from django.test import TestCase

from datasets.forms import DatasetForm

from accounts.forms import AccountForm


class DatasetFormTest(TestCase):

    def test_DatasetForm_has_correct_css_classes(self):
        form = DatasetForm()
        self.assertIn('class="form-control"', form.as_p())

    def test_DatasetForm_validation_for_blank_items(self):
        form = DatasetForm(data={'title': '', 'author': '', 'url': ''})
        self.assertFalse(form.is_valid())
        self.assertEqual(
            form.errors['title'],
            ["This field is required."])
        self.assertEqual(
            form.errors['author'],
            ["This field is required."])
        self.assertEqual(
            form.errors['url'],
            ["This field is required."])
        self.assertEqual(
            form.errors['description'],
            ["This field is required."])


class AccountFormTest(TestCase):

    def test_AccountForm_has_correct_css_classes(self):
        form = AccountForm()
        self.assertIn('class="form-control"', form.as_p())

    def test_AccountForm_validation_for_blank_items(self):
        form = AccountForm(data={"user":"", "affiliation":""})
        self.assertFalse(form.is_valid())
        self.assertEqual(
            form.errors["user"],
            ["This field is required."])
