from django.http import HttpRequest
from django.shortcuts import reverse
from django.test import TestCase, RequestFactory

from accounts.models import Account
from accounts.views import AccountView



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







'''
class UserCreationTests(TestCase):

    def test_that_User_can_be_created(self):
        user = User.objects.create_user(username="test_user",
            email="test_user@example.com",
            password="testuserpassword")
        self.assertEqual(len(User.objects.all()), 1)
        self.assertFalse(user.is_admin)
        self.assertFalse(user.is_staff)

    def test_that_SuperUser_can_be_created(self):
        superuser = User.objects.create_superuser(username="test_superuser",
            email="test_superuser@example.com",
            password="testsuperuserpassword")
        self.assertEqual(len(User.objects.all()), 1)
        self.assertTrue(superuser.is_admin)
        self.assertTrue(superuser.is_staff)


class AccountCreationTests(TestCase):

    def test_that_Account_and_User_can_be_created(self):
        user = User.objects.create_user(username="test_user",
            email="test_user@example.com",
            password="testuserpassword")
        self.assertIsInstance(user.account, models.Account)
        user.save()
        self.assertIsInstance(user.account, models.Account)


class UserCreationFormTests(TestCase):

    def test_that_UserCreationForm_renders_correctly(self):
        form = UserCreationForm()
        self.assertIn('id="id_username"', form.as_p())
        self.assertIn('id="id_email"', form.as_p())
        self.assertIn('id="id_password1"', form.as_p())
        self.assertIn('id="id_password2"', form.as_p())

    def test_UserCreationForm_validation_for_blank_USERNAME(self):
        form = UserCreationForm(data={"username": "",
                                      "email": "test_user@example.com",
                                      "password1": "testuserpassword",
                                      "password2": "testuserpassword"})
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors["username"], ["This field is required."])

    def test_UserCreationForm_validation_for_blank_EMAIL(self):
        form = UserCreationForm(data={"username": "test_user",
                                      "email": "",
                                      "password1": "testuserpassword",
                                      "password2": "testuserpassword"})
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors["email"], ["This field is required."])

    def test_UserCreationForm_validation_for_blank_PASSWORD1(self):
        form = UserCreationForm(data={"username": "test_user",
                                      "email": "test_user@example.com",
                                      "password1": "",
                                      "password2": "testuserpassword"})
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors["password1"], ["This field is required."])

    def test_UserCreationForm_validation_for_blank_PASSWORD2(self):
        form = UserCreationForm(data={"username": "test_user",
                                      "email": "test_user@example.com",
                                      "password1": "testuserpassword",
                                      "password2": ""})
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors["password2"], ["This field is required."])


class RegisterViewTests(TestCase):

    def test_register_view_FUNCTION_resolves_to_register_view(self):
        request = HttpRequest()
        response = register(request)
        self.assertEqual(response.status_code, 200)

    def test_register_view_URL_resolves_to_login_view(self):
        response = self.client.get(reverse("accounts:register"))
        self.assertEqual(response.status_code, 200)

    def test_register_view_can_save_a_POST_request(self):

        self.assertEqual(len(User.objects.all()), 0)
        data={"username": "test_user",
              "email": "test_user@example.com",
              "password1": "testuserpassword",
              "password2": "testuserpassword"}
        request = HttpRequest()
        request.method = 'POST'
        request.POST = data
        response = register(request)
        user = User.objects.all()[0]
        self.assertEqual(len(User.objects.all()), 1)
        self.assertEqual(user.username, 'test_user')
        self.assertEqual(user.email, 'test_user@example.com')

    def test_register_view_uses_correct_templates(self):
        response = self.client.get(reverse("accounts:register"))
        self.assertTemplateUsed(response,
            template_name="accounts/register.html")
        self.assertTemplateUsed(response,
            template_name="base.html")


class LoginFormTests(TestCase):

    def test_that_UserLoginForm_renders_correctly(self):
        form = UserLoginForm()
        self.assertIn('id="id_query"', form.as_p())
        self.assertIn('id="id_password"', form.as_p())

    def test_UserLoginForm_is_valid_with_QUERY_is_username(self):
        User.objects.create_user(username="test_user",
            email="test_user@example.com",
            password="testuserpassword")
        data = {"query": "test_user", "password": "testuserpassword"}
        form = UserLoginForm(data=data)
        self.assertTrue(form.is_valid())

    def test_UserLoginForm_is_valid_with_QUERY_is_email(self):
        User.objects.create_user(username="test_user",
            email="test_user@example.com",
            password="testuserpassword")
        data = {"query": "test_user@example.com", "password": "testuserpassword"}
        form = UserLoginForm(data=data)
        self.assertTrue(form.is_valid())

    def test_UserLoginForm_throws_error_with_blank_QUERY(self):
        """
        There's something special about the form errors. The 'Invalid
        credentials' set in the form clean method show up, but the query
        field is the only one that has the standard 'This field is
        required' error. See below.

        {'__all__': ['Invalid crendentials'],
        'query': ['This field is required.']} != ['Invalid credentials']}
        """
        User.objects.create_user(username="test_user",
            email="test_user@example.com",
            password="testuserpassword")
        data = {"query": "", "password": "testuserpassword"}
        form = UserLoginForm(data=data)
        self.assertEquals(form.errors["query"], ["This field is required."])
        self.assertEquals(form.errors["__all__"], ["Invalid credentials"])

    def test_UserLoginForm_throws_error_with_blank_PASSWORD(self):
        User.objects.create_user(username="test_user",
            email="test_user@example.com",
            password="testuserpassword")
        data = {"query": "test_user", "password": ""}
        form = UserLoginForm(data=data)
        self.assertEquals(form.errors["password"], ["This field is required."])
        self.assertEquals(form.errors["__all__"], ["Invalid credentials"])

    def test_UserLoginForm_throws_error_with_incorrect_QUERY(self):
        User.objects.create_user(username="test_user",
            email="test_user@example.com",
            password="testuserpassword")
        data = {"query": "incorrect_data", "password": "testuserpassword"}
        form = UserLoginForm(data=data)
        self.assertEquals(form.errors["__all__"], ["Invalid credentials"])

    def test_UserLoginForm_throws_error_with_incorrect_PASSWORD(self):
        User.objects.create_user(username="test_user",
            email="test_user@example.com",
            password="testuserpassword")
        data = {"query": "test_user", "password": "incorrect_password"}
        form = UserLoginForm(data=data)
        self.assertEquals(form.errors, {"__all__": ["Invalid credentials"]})



class LoginViewTests(TestCase):

    def test_login_view_FUNCTION_resolves_to_login_view(self):
        request = HttpRequest()
        response = login_view(request)
        self.assertEqual(response.status_code, 200)

    def test_login_view_URL_resolves_to_login_view(self):
        response = self.client.get(reverse("accounts:login"))
        self.assertEqual(response.status_code, 200)

    def test_login_view_uses_correct_templates(self):
        response = self.client.get(reverse("accounts:login"))
        self.assertTemplateUsed(response,
            template_name="accounts/login.html")
        self.assertTemplateUsed(response,
            template_name="base.html")

#    def test_login_view_logs_user_in(self):
#        pass
#
#    def test_login_view_redirects_to_portal(self):
#        pass
'''
