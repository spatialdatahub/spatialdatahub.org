from django.test import TestCase

from accounts.forms import AccountForm


class AccountFormTest(TestCase):

    def test_AccountForm_has_correct_css_classes(self):
        form = AccountForm()
        self.assertIn('class="form-control"', form.as_p())
