from django.core.urlresolvers import reverse
from django.db import models
from django.utils.text import slugify

from accounts.models import Account

from cryptography.fernet import Fernet
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
f = BASE_DIR + "/temp_password.txt"
g = open(f)
key = g.read()
g.close()
cipher_start = Fernet(key)


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
    EXTCHOICES = {"csv": "csv", "kml": "kml", "geojson": "geojson"}

    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    author = models.CharField(max_length=200)
    title = models.CharField(max_length=50)
    description = models.TextField()
    url = models.URLField(max_length=500)
    dataset_user = models.CharField(max_length=500,
                                    blank=True, unique=False)
    dataset_password = models.CharField(max_length=500,
                                        blank=True, unique=False)
    public_access = models.BooleanField(default=True)

    owncloud = models.BooleanField(default=True)
    owncloud_instance = models.CharField(default=False, max_length=500)
    owncloud_path = models.CharField(default=False, max_length=500)

    dataset_slug = models.SlugField(max_length=50, unique=False)
    date_added = models.DateTimeField(auto_now=False, auto_now_add=True,
                                      blank=True, null=True)
    ext = models.CharField(max_length=12, default="geojson",
                           blank=True, null=True)

    class Meta:
        unique_together = ("account", "title")

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.url.lower().endswith(".csv"):
            self.ext = "csv"
        elif self.url.lower().endswith(".kml"):
            self.ext = "kml"
        else:
            self.ext = "geojson"

        # encrypt the password and username
        if self.dataset_password:
            bytes_password = self.dataset_password.encode('utf-8')
            self.dataset_password = cipher_start.encrypt(bytes_password)

        if self.dataset_user:
            bytes_user = self.dataset_user.encode('utf-8')
            self.dataset_user = cipher_start.encrypt(bytes_user)

        self.dataset_slug = slugify(self.title)
        super(Dataset, self).save(*args, **kwargs)

    def get_absolute_url(self):
        kwargs = {"account_slug": self.account.account_slug,
                  "dataset_slug": self.dataset_slug,
                  "pk": self.pk}
        return reverse("datasets:dataset_detail", kwargs=kwargs)
