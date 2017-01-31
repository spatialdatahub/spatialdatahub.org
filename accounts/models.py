from django.core.urlresolvers import reverse
from django.db import models
from django.utils.text import slugify


class Account(models.Model):
    user = models.CharField(max_length=50, unique=True)
    affiliation = models.CharField(max_length=200, null=True, blank=True)
    account_slug = models.SlugField(max_length=50, unique=True)
    date_added = models.DateTimeField(auto_now=False, auto_now_add=True,
                                      null=True, blank=True)

    def __str__(self):
        return str(self.user)

    def save(self, *args, **kwargs):
        self.account_slug = slugify(self.user)
        super(Account, self).save(*args, **kwargs)

    def get_absolute_url(self):
        kwargs = {"account_slug": self.account_slug}
        return reverse("accounts:account_detail", kwargs=kwargs)
