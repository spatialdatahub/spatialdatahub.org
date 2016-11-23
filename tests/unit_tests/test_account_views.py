from django.http import HttpRequest
from django.test import TestCase, Client
from django.core.urlresolvers import reverse

from accounts.forms import AccountForm
from accounts.views import new_account



class NewAccountViewTests(TestCase):

    def test_new_account_url_resolves_to_new_account_view(self):
        request = HttpRequest()
        response = new_account(request)
        self.assertEqual(response.status_code, 200)

    def test_new_account_view_uses_correct_template(self):
        response = self.client.get(reverse("accounts:new_account"))
        self.assertTemplateUsed(response,
            template_name="accounts/new_account.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_dataset_new_account_view_url_title_is_correct(self):
        response = self.client.get(reverse("accounts:new_account"))
        self.assertIn("<title>ZMT | New Account</title>", response.content.decode("utf-8"))

    def test_new_account_view_uses_DatasetForm(self):
        response = self.client.get(reverse("accounts:new_account"))
        self.assertIsInstance(response.context["form"], AccountForm)

    def test_new_account_view_redirects_to_account_detail_view_on_save(self):
        response = self.client.post(reverse("accounts:new_account"),
            data={"user":"test_user", "affiliation": "zmt"})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response["location"], '/test_user/')
