from django.http import HttpRequest
from django.test import TestCase, Client
from django.contrib.auth import get_user_model

from accounts import models
from accounts.models import Account
from accounts.forms import UserCreationForm
from accounts.views import register

User = get_user_model()

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


# these next two class should probably be combined somehow
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

    def test_register_url_resolves_to_register_view(self):
        request = HttpRequest()
        response = register(request)
        self.assertEqual(response.status_code, 200)


    def test_register_view_can_save_a_POST_request(self):

        """This test fails because it redirects to a different page"""

        data={"username": "test_user",
              "email": "test_user@example.com",
              "password1": "testuserpassword",
              "password2": "testuserpassword"}
        request = HttpRequest()
        request.method = 'POST'
        request.POST = data
        response = register(request)
        print(response)
        self.assertIn('test_user', response.content.decode())
        self.assertIn('test_user@example.com', response.content.decode())
        self.assertNotIn('testuserpassword', response.content.decode())


    """
    Having problems with the django test client
#    def test_register_view_uses_correct_template(self):
#        response = self.client.get('/accounts/register')
#        print(response)
#        self.assertTemplateUsed(response,
#            template_name="accounts/register.html")
#        self.assertTemplateUsed(response,
#            template_name="base.html")

#    def test_register_url_resolves_to_register_view(self):
#        request = HttpRequest()
#        response = register(request)
#        response = client.get("accounts/register")
#        print(response)
#        self.assertTemplateUsed(response,
#            template_name="accounts/register.html")
#        self.assertTemplateUsed(response,
#            template_name="base.html")
    """

