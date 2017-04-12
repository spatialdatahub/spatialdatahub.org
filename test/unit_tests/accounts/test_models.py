from django.contrib.auth.models import User
from django.db.utils import IntegrityError
from django.test import TestCase

from accounts.models import Account


class AccountModelTests(TestCase):
    """
    These tests should stand alone. We will see if they do as I change
    different things in the web app.
    """
    def setUp(self):
        self.u1 = User.objects.create_user(
            username="test_user", password="test_password")

        self.a1 = self.u1.account
        self.a1.affiliation = "Zentrum für Marine Tropenökologie"
        self.a1.save()

    def test_that_account_object_can_be_saved_to_database_and_found(self):
        """
        I've already saved an account object to the database with the setUp
        test method, so I am now going to get the account object and assert
        the user, affiliation, and slug are correct
        """
        test_account = Account.objects.get(account_slug="test_user")
        self.assertEqual(test_account.user, self.u1)
        self.assertEqual(test_account.affiliation,
                         "Zentrum für Marine Tropenökologie")
        self.assertEqual(test_account.account_slug, "test_user")

    def test_that_accounts_with_same_user_name_cannot_be_saved(self):
        with self.assertRaises(IntegrityError):
            Account.objects.create(user=self.u1, affiliation="zmt")

    def test_account_method_get_absolute_url_returns_correct_url(self):
        expected_url = "/{account_slug}/".format(
            account_slug=self.a1.account_slug)
        self.assertEqual(self.a1.get_absolute_url(), expected_url)
