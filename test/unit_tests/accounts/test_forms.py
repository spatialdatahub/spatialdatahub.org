from django.test import TestCase

from accounts.forms import AccountForm


class AccountFormTest(TestCase):

    def test_AccountForm_has_correct_css_classes(self):
        form = AccountForm()
        self.assertIn('class="form-control"', form.as_p())

    def test_AccountForm_validation_for_blank_items(self):
        form = AccountForm(data={"user": "", "affiliation": ""})
        self.assertFalse(form.is_valid())
        self.assertEqual(
            form.errors["user"],
            ["This field is required."])
