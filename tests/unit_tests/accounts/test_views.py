from django.http import HttpRequest
from django.test import TestCase, Client
from django.core.urlresolvers import reverse

from accounts.forms import AccountForm
from accounts.models import Account
from accounts.views import new_account
from accounts.views import account_list
from accounts.views import account_update
from accounts.views import account_remove


class NewAccountViewTests(TestCase):

    def test_new_account_url_resolves(self):
        response = self.client.get("/new_account/")
        self.assertEqual(response.status_code, 200)

    def test_new_account_function_resolves(self):
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

    def test_new_account_view_uses_AccountForm(self):
        response = self.client.get(reverse("accounts:new_account"))
        self.assertIsInstance(response.context["form"], AccountForm)

    def test_new_account_view_redirects_to_account_detail_view_on_save(self):
        response = self.client.post(reverse("accounts:new_account"),
            data={"user":"test_user", "affiliation": "zmt"})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response["location"], "/test_user/")


class AccountListViewTests(TestCase):

    def setUp(self):
        self.a1 = Account.objects.create(user="test_user",
            affiliation="Zentrum für Marine Tropenökologie")

    def test_account_list_url_resolves_to_account_list_view(self):
        response = self.client.get("/accounts/")
        self.assertEqual(response.status_code, 200)

    def test_account_list_function_resolves(self):
        request = HttpRequest()
        response = account_list(request)
        self.assertEqual(response.status_code, 200)

    def test_account_list_view_uses_correct_templates(self):
        response = self.client.get(reverse("accounts:account_list"))
        self.assertTemplateUsed(response,
            template_name="accounts/account_list.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_account_list_view_title_is_correct(self):
        response = self.client.get(reverse("accounts:account_list"))
        self.assertIn("<title>ZMT | Accounts</title>", response.content.decode("utf-8"))

    def test_account_list_shows_accounts_on_page(self):
        response = self.client.get(reverse("accounts:account_list"))
        self.assertIn("test_user", response.content.decode("utf-8"))


class AccountUpdateViewTests(TestCase):

    def setUp(self):
        self.a1 = Account.objects.create(user="test_user",
            affiliation="Zentrum für Marine Tropenökologie")

    def test_account_update_url_resolves_to_account_update_view(self):
        response = self.client.get("/test_user/update/")
        self.assertEqual(response.status_code, 200)

    def test_account_update_function_resolves(self):
        request = HttpRequest()
        response = account_update(request, account_slug=self.a1.account_slug)
        self.assertEqual(response.status_code, 200)

    def test_account_update_view_uses_correct_templates(self):
        response = self.client.get(reverse("accounts:account_update",
            kwargs={"account_slug": self.a1.account_slug}))
        self.assertTemplateUsed(response,
            template_name="accounts/account_update.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_account_update_view_title_is_correct(self):
        response = self.client.get(reverse("accounts:account_update",
            kwargs={"account_slug": self.a1.account_slug}))
        self.assertIn("<title>ZMT | Update {}</title>".format(self.a1.user),
            response.content.decode("utf-8"))

    def test_account_update_view_uses_DatasetForm(self):
        response = self.client.get(reverse("accounts:account_update",
            kwargs={"account_slug": self.a1.account_slug}))
        self.assertIsInstance(response.context["form"], AccountForm)

    def test_account_update_view_redirects_to_account_detail_view_on_save(self):
        response = self.client.post(reverse("accounts:account_update",
            kwargs={"account_slug": self.a1.account_slug}),
            data={"user":"changed_test_user", "affiliation": "ZMT"})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response["location"], "/changed_test_user/")

# should this be tested here?
#    def test_account_update_view_updates_account_data(self):
#        request = HttpRequest()
#        request.method = "POST"
#        request.POST["user"] = "changed_test_user"
#        request.POST["affiliation"] = "some unique words"
#        response = account_update(request, account_slug=self.a1.account_slug)
#        self.assertEqual(response.url, "/changed_test_user/")
#        self.fail("can't seem to get posted data from account object")


class AccountRemoveViewTests(TestCase):

    def setUp(self):
        self.a1 = Account.objects.create(user="test_user",
            affiliation="Zentrum für Marine Tropenökologie")

    def test_account_remove_url_resolves_to_account_remove_view(self):
        response = self.client.get("/"+self.a1.account_slug+"/remove/")
        self.assertEqual(response.status_code, 200)

    def test_account_remove_function_resolves_to_account_remove_view(self):
        request = HttpRequest()
        response = account_remove(request, account_slug=self.a1.account_slug)
        self.assertEqual(response.status_code, 200)

    def test_account_remove_view_uses_correct_templates(self):
        response = self.client.get(reverse("accounts:account_remove",
            kwargs={"account_slug": self.a1.account_slug}))
        self.assertTemplateUsed(response,
            template_name="accounts/account_remove.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

    def test_dataset_account_remove_view_url_title_is_correct(self):
        response = self.client.get(reverse("accounts:account_remove",
            kwargs={"account_slug": self.a1.account_slug}))
        self.assertIn("<title>ZMT | Remove Account</title>", response.content.decode("utf-8"))

    def test_account_remove_view_redirects_to_portal_view_on_save(self):
        response = self.client.post(reverse("accounts:account_remove",
            kwargs={"account_slug": self.a1.account_slug}))
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response["location"], "/")

# should this be tested here?
#    def test_account_remove_view_removes_account_data(self):
#        request = HttpRequest()
#        request.method = "POST"
#        response = account_remove(request, account_slug=self.a1.account_slug)
#        self.assertEqual(response.url, "/")
#        print(self.a1)
#        self.fail("can't seem to get posted data from account object")


