from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import ListView

from datasets.models import Dataset
from accounts.models import Account

import requests
#import os
#from cryptography.fernet import Fernet

#import json



def load_dataset(request, pk):
    """
    This needs to be fixed to run asynchronously, incase of a very large
    dataset
    Fix this so that it works as ajax or something.

    Also there needs to be a better way to hide the cryptokey

    Bringing in different types of datasets (kml, csv, geojson) isn't much fun.
    """
    # bring in the dataset and save it to a json object
    dataset = Dataset.objects.get(pk=pk)
    r = requests.get(dataset.url).content
    data = r
    return HttpResponse(data)


def portal(request):
    account_list = Account.objects.all()
    dataset_list = Dataset.objects.all()
    template_name = "portal.html"

    if "q" in request.GET:
        q = request.GET["q"]
        dataset_list = Dataset.objects.filter(title__icontains=q).order_by("title")

    return render(request, template_name,
        {"account_list": account_list, "dataset_list": dataset_list})


def jstests(request):
    dataset_list = Dataset.objects.all()
    template_name = "jstests.html"
    return render(request, template_name, {"dataset_list": dataset_list})

