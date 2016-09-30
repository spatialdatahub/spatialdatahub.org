from django.core.urlresolvers import reverse
from django.db import models
from django.utils.text import slugify

from cryptography.fernet import Fernet
import os

class Dataset(models.Model):
    """
    This is the webapplication's main model, it will be have to be
    linked to user accounts so that authentication can be used to
    deal with data access. This model will not hold more than the
    metadata for a GIS dataset, a reference to the other data set's
    uri, and whether the dataset has a password or not.
    """

    author = models.CharField(max_length=200)
    title = models.CharField(max_length=50)
    description = models.TextField()
    url = models.URLField(max_length=500)
    dataset_user = models.CharField(max_length=120, blank=True)
    dataset_password = models.CharField(max_length=120, blank=True)
    public_access = models.BooleanField(default=True)
    slug = models.SlugField(max_length=50, unique=False)


    def __str__(self):
        return self.title


    def save(self, *args, **kwargs):
        # create slug
        self.slug = slugify(self.title)

        # encrypt dataset_password
        dspw_key = os.environ['CRYPTOKEY_DSPW'].encode('UTF-8')
        dspw_f = Fernet(dspw_key)
        dspw = self.dataset_password.encode('UTF-8')
        self.dataset_password = dspw_f.encrypt(dspw).decode('UTF-8')

        # encrypt dataset_user
        dsu_key = os.environ['CRYPTOKEY_DSU'].encode('UTF-8')
        dsu_f = Fernet(dsu_key)
        dsu = self.dataset_user.encode('UTF-8')
        self.dataset_user= dsu_f.encrypt(dsu).decode('UTF-8')

        super(Dataset, self).save(*args, **kwargs)


    def get_absolute_url(self):
        kwargs = {'slug': self.slug, 'pk': self.pk}
        return reverse('datasets:dataset_detail', kwargs=kwargs)
