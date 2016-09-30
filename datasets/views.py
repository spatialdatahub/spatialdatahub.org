from django.core.urlresolvers import reverse_lazy
from django.http import HttpResponse, Http404
from django.views.generic import DetailView, TemplateView, ListView
from django.views.generic.edit import CreateView, DeleteView, UpdateView

from datasets.models import Dataset

import requests
import os
from cryptography.fernet import Fernet



"""
Making big change:
I still need to figure out a good way to deal with KML and KMZ files.

Dealing with passwords and usernames is frustrating, I need a better
way of making sure that they are secure.

# I will do this by using base64 encode and decode with a randomizer. The
# randomizer will be based on a key that I set in the environment. This key
# will be set up the same way as the passwords for the Django settings file are
# set up.



"""


def load_dataset(request, pk):
    """
    This will be a function that loads the datasets to the leafletjs map
    background on button click, instead on initial page load.
    """
    dataset = Dataset.objects.get(pk=pk)
    if dataset.dataset_user and dataset.dataset_password:

        # bring in the environmental crypto keys
        dsu_key = os.environ['CRYPTOKEY_DSU'].encode('UTF-8')
        dspw_key = os.environ['CRYPTOKEY_DSPW'].encode('UTF-8')

        # decode the dataset_user
        f_dsu = Fernet(dsu_key)
        b_user = (dataset.dataset_user).encode('UTF-8')
        decrypted_user = f_dsu.decrypt(b_user).decode('UTF-8')

        # decode the dataset_password
        f_dspw = Fernet(dspw_key)
        b_password = (dataset.dataset_password).encode('UTF-8')
        decrypted_password= f_dspw.decrypt(b_password).decode('UTF-8')


        r = requests.get(dataset.url,
        auth = (decrypted_user,
        decrypted_password)).content
        data = r
    else:
        r = requests.get(dataset.url).content
        data = r
    return HttpResponse(data)

    """
    if request.is_ajax():
        dataset = Dataset.objects.get(pk=pk)
        if dataset.dataset_user and dataset.dataset_password:
            r = requests.get(dataset.url,
                auth = (dataset.dataset_user,
                dataset.dataset_password)).content
            data = r
        else:
            r = requests.get(dataset.url).content
            data = r
        return HttpResponse(data)
    else:
#        raise Http404
        return HttpResponse('not ajax')
    """

class PortalView(ListView):
    """
    This is the main view on the site. It should be a simple list view without
    any special methods. Only the model, context object name and template
    should be defined. I will remove the get_queryset method and replace it
    with an ajax call function.
    """

    model = Dataset
    context_object_name = 'dataset_list'
    template_name = 'datasets/portal.html'

    """
    I need to figure out how to fix this so that it works with ajax and the
    context object view. As it is this is just extra work that the view has
    to do.
    """
    def get_queryset(self):
        queryset = super(PortalView, self).get_queryset()

        if 'q' in self.request.GET:
            q = self.request.GET['q']
            queryset = Dataset.objects.filter(title__icontains=q).order_by('title')
        return queryset


#########################################################################
# It would be nice to create a function that does a dataset check, that way
# I wouldn't have to repeat the code between the create and update views. Maybe
# the code should be part of the DatasetForm

# I need to think of a good way to deal with password/username data for
# authentication with requests.

# I also need to make everything work with ajax calls



class DatasetDetailView(DetailView):
    """
    This is the view that will show all of a dataset's meta data. The map will
    be autopopulated with the dataset on page load. The page load will use the
    same ajax call as that the portal page uses. This ajax call will be reused
    on the dataset update page as well.
    """

    model = Dataset
    context_object_name = 'dataset'
    template_name = 'datasets/dataset_detail.html'


class DatasetCreateView(CreateView):
    """
    I need to have a method that encrypts the dataset_user and dataset_password
    fields the same method should be useable on the update view

    Instead of dealing with this logic here, I will deal with it at the model
    """

    model = Dataset
    fields= ['author', 'title', 'url', 'dataset_user', 'dataset_password',
             'public_access', 'description']
    template_name = 'datasets/dataset_create.html'


class DatasetUpdateView(UpdateView):
    """
    This is the view that will allow a user to modify a dataset's meta data and
    url. The map will be autopopulated with the dataset on page load.
    The page load will use the same ajax call as that the portal page uses.
    """

    model = Dataset
    fields= ['author', 'title', 'url', 'dataset_user', 'dataset_password',
             'public_access', 'description']
    context_object_name = 'dataset'
    template_name = 'datasets/dataset_update.html'


class DatasetRemoveView(DeleteView):
    model = Dataset
    success_url = reverse_lazy('datasets:portal')
    template_name = 'datasets/dataset_confirm_remove.html'


class AboutView(TemplateView):
    template_name="datasets/about.html"


class ContactView(TemplateView):
    template_name="datasets/contact.html"
