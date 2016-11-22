from django.http import HttpRequest
from django.shortcuts import reverse
from django.test import TestCase, RequestFactory

from accounts.models import Account
from accounts.views import account_detail



class AccountViewTests(TestCase):

    def test_AccountView_works_as_view(self):
        request = RequestFactory().get('')
        response = AccountView.as_view()(request)
        self.assertEqual(response.status_code, 200)

    def test_AccountView_uses_correct_template(self):
        #response = self.client.get(reverse('accounts:account_view'))
        response = self.client.get('/accounts/account_view/')
        self.assertTemplateUsed(response,
            template_name="accounts/account_view.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

