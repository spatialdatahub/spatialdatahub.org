from django.contrib.auth.models import AbstractUser, UserManager


class CustomUserManager(UserManager):
    """Something is missing, this isn't catching the problem"""

    def get_by_natural_key(self, username):
        return self.get(username__iexact=username)


class User(AbstractUser):
    objects = CustomUserManager()
