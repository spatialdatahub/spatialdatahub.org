from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models


class CustomUserManager(UserManager):
    """Something is missing, this isn't catching the problem"""

    def get_by_natural_key(self, username):
        #case_insensitive_username = '{}__iexact'.format(self.model.USERNAME_FIELD)
        #return self.get(**{case_insensitive_username: username})
        return self.get(username__iexact = username)


class CustomUser(AbstractUser):
    objects = CustomUserManager()
