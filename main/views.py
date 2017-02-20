from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render

from datasets.models import Dataset
from accounts.models import Account

import requests
import os
from cryptography.fernet import Fernet


def load_dataset(request, pk):
    """
    This needs to be fixed to run asynchronously, incase of a very large
    dataset
    Fix this so that it works as ajax or something.

    Also there needs to be a better way to hide the cryptokey

    Bringing in different types of datasets (kml, csv, geojson) isn't much fun.

    Start with unencrypted authentication information

    These things should only be called when a password protected dataset needs
    to be loaded

    """
    # bring in the dataset by pk
    dataset = Dataset.objects.get(pk=pk)
    if dataset.dataset_password:
        # the basedir/filepath stuff can probably be done better
        # set base dir
        base_dir = os.path.dirname(
            os.path.dirname(os.path.abspath(__file__)))
        # get key from file
        f = base_dir + "/temp_password.txt"
        g = open(f)
        key = g.read().encode("utf-8")
        g.close()
        cipher_end = Fernet(key)

        # this would probably go better with a little loop or something
        bytes_user = dataset.dataset_user.encode("utf-8")
        bytes_password = dataset.dataset_password.encode("utf-8")
        decrypted_user = cipher_end.decrypt(bytes_user).decode("utf-8")
        decrypted_password = cipher_end.decrypt(bytes_password).decode("utf-8")
        r = requests.get(dataset.url,
                         auth=(decrypted_user, decrypted_password)).content
    else:
        r = requests.get(dataset.url).content
    data = r
    return HttpResponse(data)


def portal(request):
    user_list = User.objects.all()
    account_list = Account.objects.all()
    dataset_list = Dataset.objects.all()
    template_name = "portal.html"

    if "q" in request.GET:
        q = request.GET["q"]
        dataset_list = Dataset.objects.filter(
            title__icontains=q).order_by("title")

    return render(request, template_name,
                  {"user_list": user_list,
                   "account_list": account_list,
                   "dataset_list": dataset_list})


def jstests(request):
    dataset_list = Dataset.objects.all()
    template_name = "jstests.html"
    return render(request, template_name, {"dataset_list": dataset_list})
