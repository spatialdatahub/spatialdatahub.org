from django.test import TestCase

#from datasets.forms import DatasetForm
# I am going to break the functionality of the webapp if I do this
# I will do it after I show it to Alessio

"""
from datasets.forms import DatasetForm


class DatasetFormTest(TestCase):

    def test_form_renders_dataset_text_input(self):
        form  = DatasetForm()
        self.fail(form.as_p())

    def test_form_dataset_input_has_css_classes(self):
        form = DatasetForm()
        self.assertIn('class="form-control input-lg"', form.as_p())

    def test_form_validation_for_blank_items(self):
        form = DatasetForm(data={'author': '', 'title': '', 'description': '',
                                 'url': ''}
        self.assertFalse(form.is_valid())
        form.assertEqual(
            form.errors['author'],
            ["You can't have an empty list item"]
        )

        form.assertEqual(
            form.errors['title'],
            ["You can't have an empty list item"]
        )

        form.assertEqual(
            form.errors['description'],
            ["You can't have an empty list item"]
        )

        form.assertEqual(
            form.errors['url'],
            ["You can't have an empty list item"]
        )

"""
