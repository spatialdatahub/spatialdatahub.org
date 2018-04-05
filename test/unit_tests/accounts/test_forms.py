from django.test import TestCase

from accounts.forms import AccountForm


class AccountFormTest(TestCase):

    def test_AccountForm_allows_blank_items(self):
        form = AccountForm(data={"affiliation": ""})
        self.assertTrue(form.is_valid())
