from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models


class CustomUserManager(UserManager):
    def get_by_natural_key(self, username):
        case_insensitive_username = '{}__iexact'.format(self.model.USERNAME_FIELD)
        return self.get(**{case_insensitive_username: username})


class CustomUser(AbstractUser):
    objects = CustomUserManager()
