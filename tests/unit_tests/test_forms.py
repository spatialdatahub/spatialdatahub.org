from django.test import TestCase

from datasets.forms import DatasetForm


class DatasetFormTest(TestCase):

    def test_form_renders_dataset_text_input(self):
        form = DatasetForm()
        self.assertIn('placeholder="Dataset Title"', form.as_p())
        self.assertIn('class="form-control input-lg"', form.as_p())

    def test_form_validation_for_blank_items(self):
        form = DatasetForm(data={'title': '', 'author': ''})
        self.assertFalse(form.is_valid())
        self.assertEqual(
            form.errors['title'],
            ["This field is required."],
        )
