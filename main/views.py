from django.core import serializers
from django.core.exceptions import ImproperlyConfigured
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import render

from django.views.generic import TemplateView

from datasets.models import Dataset

import requests
import owncloud
import json

from cryptography.fernet import Fernet


def load_dataset(request, pk):
    """
    This needs to be fixed to run asynchronously, incase of a very large
    dataset, actually... would that even matter?

    Maybe there's a better wy to do this whole secret crypto key thing, I
    still don't feel like it's secure enough
    """
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
    cipher_end = Fernet(CRYPTO_KEY)

    # bring in the dataset by pk
    dataset = Dataset.objects.get(pk=pk)

    # this would probably go better with a little loop or something
    bytes_user = dataset.dataset_user.encode("utf-8")
    bytes_password = dataset.dataset_password.encode("utf-8")
    decrypted_user = cipher_end.decrypt(bytes_user).decode("utf-8")
    decrypted_password = cipher_end.decrypt(bytes_password).decode("utf-8")

    # use owncloud stuff, if the owncloud thing is true
    if dataset.owncloud:
        # owncloud, instead of requests.
        oc = owncloud.Client(dataset.owncloud_instance)
        oc.login(decrypted_user, decrypted_password)
        data = oc.get_file_contents(dataset.owncloud_path)
    else:
        data = requests.get(dataset.url,
                            auth=(decrypted_user, decrypted_password)).content

    return HttpResponse(data)


# the search function on this page should be controlled by another view
# and called with ajax
def portal(request):
    """
    I'm not ready to try and make this filter function ajax yet. That will
    have to wait a bit longer.
    """
    D = Dataset.objects.all()

    if "q" in request.GET:
        q = request.GET["q"]
        dataset_list = D.filter(
            Q(title__icontains=q) |
            Q(account__user__username__icontains=q) |
            Q(author__icontains=q) |
            Q(keywords__keyword__icontains=q)
            ).order_by("title").distinct()
    else:
        dataset_list = D.order_by("title")

    template_name = "portal.html"
    return render(request, template_name, {"dataset_list": dataset_list})


# do I have a reason to do this as a class based view?
# no.

def portal_serialized(request):
    D = Dataset.objects.all()

    if "q" in request.GET:
        q = request.GET["q"]
        dataset_list = D.filter(
            Q(title__icontains=q) |
            Q(account__user__username__icontains=q) |
            Q(author__icontains=q) |
            Q(keywords__keyword__icontains=q)
            ).order_by("title").distinct()
    else:
        dataset_list = D.order_by("title")

    json_data = serializers.serialize("json", dataset_list, fields=("title",
                                                                    "author",
                                                                    "dataset_slug",
                                                                    "account",
                                                                    "description",
                                                                    "url",
                                                                    "ext",
                                                                    "keywords"))
    context = {
        "dataset_list": dataset_list,
        "json_data": json_data
    }

    template_name = "portal_serialized.html"
    return render(request, template_name, context)
