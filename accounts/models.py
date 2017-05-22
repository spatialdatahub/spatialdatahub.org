from django.core.urlresolvers import reverse
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.text import slugify

from django.conf import settings


class Account(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    affiliation = models.CharField(max_length=200, null=True, blank=True)
    account_slug = models.SlugField(max_length=50, unique=True, null=True)
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


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_account(sender, instance, created, **kwargs):
    if created:
        Account.objects.create(user=instance)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def save_user_account(sender, instance, **kwargs):
    instance.account.save()
