from django.core.exceptions import ImproperlyConfigured
from django.urls import reverse
from django.db import models
from django.utils.text import slugify

from accounts.models import Account
from keywords.models import Keyword

from cryptography.fernet import Fernet

import os
import json

# This is pretty much copied from the two scoops of django 1.8 book
# It's actually supposed to be for the settings module, but I thought
# it would be a good place to keep the crypto key as well. We'll see
# JSON based secrets module

# Maybe this could be imported from settings or something? Maybe it
# could be kept in a different file called 'crypto.json'
#with open("secrets.json") as f:
#    secrets = json.loads(f.read())
if 'TRAVIS' in os.environ:
    with open("travis-secrets.json") as f:
        secrets = json.loads(f.read())
else:
    with open("secrets.json") as f:
        secrets = json.loads(f.read())



def get_secret(setting, secrets=secrets):
    """Get the secret variable or return the explicit exception."""
    try:
        return secrets[setting]
    except KeyError:
        error_msg = "Set the {0} environment variable".format(setting)
        raise ImproperlyConfigured(error_msg)


CRYPTO_KEY = get_secret("CRYPTO_KEY")
cipher = Fernet(CRYPTO_KEY)


class Dataset(models.Model):
    """
    This is the webapplication's main model, it will be have to be
    linked to user accounts so that authentication can be used to
    deal with data access. This model will not hold more than the
    metadata for a GIS dataset, a reference to the other data set's
    uri, and whether the dataset has a password or not.

    I am going to create a method to save the dataset's extension as
    a model field.
    """

    account = models.ForeignKey(Account,
                                on_delete=models.CASCADE,
                                related_name='datasets')
    keywords = models.ManyToManyField(Keyword,
                                      related_name='datasets',
                                      blank=True)
    author = models.CharField(max_length=200, null=True)
    title = models.CharField(max_length=50, null=True)
    description = models.TextField(null=True)

    # start with tests... should this many to many be defined in the
    # keywords model itself, or in the datasets model?
    # keywords = models.ManyToMany(KeyWord, null=True, blank=True)

    # there should be an if/else for this or owncloud
    url = models.URLField(max_length=500, null=True, blank=True)
    dataset_user = models.CharField(max_length=500, null=True,
                                    blank=True, unique=False)
    dataset_password = models.CharField(max_length=500, null=True,
                                        blank=True, unique=False)
    public_access = models.BooleanField(default=True)

    owncloud = models.BooleanField(default=False)

    owncloud_instance = models.CharField(max_length=500, null=True,
                                         blank=True, unique=False)
    owncloud_path = models.CharField(max_length=500, null=True,
                                     blank=True, unique=False)

    dataset_slug = models.SlugField(max_length=50, unique=False, null=True)
    date_added = models.DateTimeField(auto_now=False, auto_now_add=True,
                                      blank=True, null=True)
    ext = models.CharField(max_length=12, default="geojson",
                           blank=True, null=True)

    class Meta:
        unique_together = ("account", "title")

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # could this could be done with a loop, would it be necessary? or
        # more readable?
        if self.owncloud == True:  # flake8 doesn't like this statement
            base = self.owncloud_path.lower()
        else:
            base = self.url.lower()

        if base.endswith("csv"):
            self.ext = "csv"
        elif base.endswith("kml"):
            self.ext = "kml"
        elif base.endswith("tsv") or base.endswith("txt"):
            self.ext = "tsv"
        else:
            self.ext = "geojson"

        # encrypt the password and username
        # I'd like to do this with the owncloud stuff as well
        if self.dataset_password:
            bytes_password = self.dataset_password.encode('utf-8')
            encrypted_password = cipher.encrypt(bytes_password)
            self.dataset_password = encrypted_password.decode('utf-8')

        if self.dataset_user:
            bytes_user = self.dataset_user.encode('utf-8')
            encrypted_user = cipher.encrypt(bytes_user)
            self.dataset_user = encrypted_user.decode('utf-8')

            self.dataset_user = cipher.encrypt(bytes_user)
            self.dataset_user = self.dataset_user.decode('utf-8')

        self.dataset_slug = slugify(self.title)
        super(Dataset, self).save(*args, **kwargs)

    def get_absolute_url(self):
        kwargs = {"account_slug": self.account.account_slug,
                  "dataset_slug": self.dataset_slug,
                  "pk": self.pk}
        return reverse("datasets:dataset_detail", kwargs=kwargs)
