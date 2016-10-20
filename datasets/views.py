from django.core.urlresolvers import reverse_lazy
from django.http import HttpResponse, Http404
from django.views.generic import DetailView, TemplateView, ListView
from django.views.generic.edit import CreateView, DeleteView, UpdateView

from datasets.models import Dataset

import requests
import os
from cryptography.fernet import Fernet


"""
I still need to figure out a good way to deal with KML and KMZ files.
"""


def load_dataset(request, pk):
    """
    This needs to be fixed to run asynchronously, incase of a very large
    dataset
    Fix this so that it works as ajax or something.
    """
    dataset = Dataset.objects.get(pk=pk)
    if dataset.dataset_user and dataset.dataset_password:
        # get cryptokey
        cryptokey = os.environ['CRYPTOKEY'].encode('UTF-8')
        cryptokey_fernet = Fernet(cryptokey)

        # password
        # turn convert password from string to bytes
        # decrypt the dataset_password with the key
        password_bytes = (dataset.dataset_password).encode('UTF-8')
        password_decrypted_bytes = cryptokey_fernet.decrypt(password_bytes)
        password_decrypted_string = password_decrypted_bytes.decode('UTF-8')

        # user 
        # turn convert user from string to bytes
        # decrypt the dataset_user with the key
        user_bytes = (dataset.dataset_user).encode('UTF-8')
        user_decrypted_bytes = cryptokey_fernet.decrypt(user_bytes)
        user_decrypted_string = user_decrypted_bytes.decode('UTF-8')

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
    """

    model = Dataset
    fields= ['author', 'title', 'url', 'dataset_user', 'dataset_password',
             'public_access', 'description']
    template_name = 'datasets/dataset_create.html'

    def form_valid(self, form):
        if form.instance.dataset_user and form.instance.dataset_password:
            # get key (I am only using one key for both password and username)
            cryptokey = os.environ['CRYPTOKEY'].encode('UTF-8')
            cryptokey_fernet = Fernet(cryptokey)

            # password
            password_bytes = (form.instance.dataset_password).encode('UTF-8')
            password_encrypted = cryptokey_fernet.encrypt(password_bytes)
            form.instance.dataset_password = password_encrypted.decode('UTF-8')

            # username
            user_bytes = (form.instance.dataset_user).encode('UTF-8')
            user_encrypted = cryptokey_fernet.encrypt(user_bytes)
            form.instance.dataset_user = user_encrypted.decode('UTF-8')

        return super(DatasetCreateView, self).form_valid(form)


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

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        self.object.initial_dataset_password = self.object.dataset_password
        return super(DatasetUpdateView, self).get(request, self, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        self.old_password = self.object.dataset_password
        self.old_user = self.object.dataset_user
        return super(DatasetUpdateView, self).post(request, *args, **kwargs)

    def form_valid(self, form):
        # double if statements here.
        if form.instance.dataset_user and form.instance.dataset_password:

            if form.instance.dataset_password != self.old_password:
                cryptokey = os.environ['CRYPTOKEY'].encode('UTF-8')
                cryptokey_fernet = Fernet(cryptokey)
                password_bytes = (form.instance.dataset_password).encode('UTF-8')
                password_encrypted = cryptokey_fernet.encrypt(password_bytes)
                form.instance.dataset_password = password_encrypted.decode('UTF-8')

            if form.instance.dataset_user != self.old_user:
                cryptokey = os.environ['CRYPTOKEY'].encode('UTF-8')
                cryptokey_fernet = Fernet(cryptokey)
                user_bytes = (form.instance.dataset_user).encode('UTF-8')
                user_encrypted = cryptokey_fernet.encrypt(user_bytes)
                form.instance.dataset_user = user_encrypted.decode('UTF-8')

        return super(DatasetUpdateView, self).form_valid(form)


class DatasetRemoveView(DeleteView):
    model = Dataset
    success_url = reverse_lazy('datasets:portal')
    template_name = 'datasets/dataset_confirm_remove.html'


class AboutView(TemplateView):
    template_name="datasets/about.html"


class ContactView(TemplateView):
    template_name="datasets/contact.html"
