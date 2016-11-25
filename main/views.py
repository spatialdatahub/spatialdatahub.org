from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import ListView

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
    """
    dataset = Dataset.objects.get(pk=pk)
    if dataset.dataset_user and dataset.dataset_password:
        # get cryptokey
        cryptokey = os.environ["CRYPTOKEY"].encode("UTF-8")
        cryptokey_fernet = Fernet(cryptokey)

        # password
        # turn convert password from string to bytes
        # decrypt the dataset_password with the key
        password_bytes = (dataset.dataset_password).encode("UTF-8")
        password_decrypted_bytes = cryptokey_fernet.decrypt(password_bytes)
        password_decrypted_string = password_decrypted_bytes.decode("UTF-8")

        # user 
        # turn convert user from string to bytes
        # decrypt the dataset_user with the key
        user_bytes = (dataset.dataset_user).encode("UTF-8")
        user_decrypted_bytes = cryptokey_fernet.decrypt(user_bytes)
        user_decrypted_string = user_decrypted_bytes.decode("UTF-8")

        # finally make the request with the authentication password and
        # username
        r = requests.get(dataset.url, auth = (
        user_decrypted_string, password_decrypted_string)).content
        data = r
    else:
        r = requests.get(dataset.url).content
        data = r
    return HttpResponse(data)




def portal(request, account_slug=None):
    account_list = Account.objects.all()
    dataset_list = Dataset.objects.all()
    template_name = "portal.html"

    if "q" in request.GET:
        q = request.GET["q"]
        dataset_list = Dataset.objects.filter(title__icontains=q).order_by("title")

    return render(request, template_name,
        {"account_list": account_list, "dataset_list": dataset_list})
