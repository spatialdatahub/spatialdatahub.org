from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserModelTests(TestCase):

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
