from django.http import HttpResponse
from django.views.generic import ListView

from datasets.models import Dataset

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





class PortalView(ListView):
    """
    This is the main view on the site. It should be a simple list view without
    any special methods. Only the model, context object name and template
    should be defined. I will remove the get_queryset method and replace it
    with an ajax call function.
    """

    model = Dataset
    context_object_name = "dataset_list"
    template_name = "portal.html"

    def get_queryset(self):
        queryset = super(PortalView, self).get_queryset()
        if "q" in self.request.GET:
            q = self.request.GET["q"]
            queryset = Dataset.objects.filter(title__icontains=q).order_by("title")
        return queryset


