from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import render

from datasets.models import Dataset
from datasets.models import Keyword

import requests
import owncloud
import os
from cryptography.fernet import Fernet


def load_dataset(request, pk):
    """
    This needs to be fixed to run asynchronously, incase of a very large
    dataset, actually... would that even matter?

    Also there needs to be a better way to hide the cryptokey

    This needs to be changed so that it only runs if the url requires
    authentication
    """
    # bring in the dataset by pk
    dataset = Dataset.objects.get(pk=pk)
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
    dataset_list = Dataset.objects.all()
    template_name = "portal.html"

    if "q" in request.GET:
        q = request.GET["q"]
        dataset_list = Dataset.objects.filter(
            Q(title__icontains=q) | Q(author__icontains=q)).order_by("title")

    return render(request, template_name, {"dataset_list": dataset_list})


def jstests(request):
    dataset_list = Dataset.objects.all()
    template_name = "jstests.html"
    return render(request, template_name, {"dataset_list": dataset_list})


def one_time_view(request):
    template_name = "one_time_view.html"
    return render(request, template_name)


# should this be in the dataset app, or should it be in it's own app?
def keyword_list(request):
    """
    This is a view that will show all the keywords.
    """
    keyword_list = Keyword.objects.all()
    template_name = "datasets/keyword_list.html"

    # how do I put this into an ajax call?
    # check the django ajax project
#    if "q" in request.GET:
#        q = request.GET["q"]
#        dataset_list = Keyword.objects.filter().order_by("keyword")

    return render(request, template_name, {"keyword_list": keyword_list})

'''
def keyword_detail(request, keyword_slug):
    """
    This view will show all the datasets and accounts associated with
    each keyword
    """
    keyword = get_object_or_404(Keyword, keyword_slug=keyword_slug) 
    template_name = "datasets/keyword_detail.html"
    return render(request, template_name, {"keyword": keyword})
'''

