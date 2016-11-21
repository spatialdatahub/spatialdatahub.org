from django.core.urlresolvers import reverse
from django.db import models
from django.utils.text import slugify


class Account(models.Model):
    user = models.CharField(max_length=50, unique=True)
    affiliation = models.CharField(max_length=200, null=True, blank=True)
    account_slug = models.SlugField(max_length=50, null=True, blank=True, unique=True)

    def __str__(self):
        return str(self.user)

    def save(self, *args, **kwargs):
        self.account_slug = slugify(self.user)
        super(Account, self).save(*args, **kwargs)

    def get_absolute_url(self):
        kwargs = {"account_slug": self.account_slug}
        return reverse("datasets:account_detail", kwargs=kwargs)
