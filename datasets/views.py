from django.core.urlresolvers import reverse_lazy
from django.shortcuts import render
from django.views.generic import DetailView
from django.views.generic.edit import CreateView, DeleteView, UpdateView

from datasets.models import Dataset

import requests
import json


"""
Making big change:
I still need to figure out a good way to deal with KML and KMZ files.

Dealing with passwords and usernames is frustrating, I need a better
way of making sure that they are secure.
"""



def portal(request):
    """
    I need to make a way for the data requests to be called from the template.
    That way I can load only the names of the datasets into the portal page as
    a list, and then pull in the data when the user wants it. It is extremely
    slow to have to load all the data on every page load. There are already too
    different javascript and css files linked up to this page.

    AJAX calls to an asynchronous request function will be used to get the
    data from the urls

    Can I do this with a class based view? Like a list view?
    """

    dataset_list = Dataset.objects.all().order_by('title')

    ### Do I need this queryset thing here? Can I just write something in
    ### javascript that does it for me?
    if 'q' in request.GET:
        q = request.GET['q']
        dataset_list = Dataset.objects.filter(title__icontains=q).order_by('title')
    ###

    ### This logic needs to be a function that can be called by ajax. 
    ### Perhaps from a different file. 
    ### Maybe as a separate view.
    ### Maybe as a class with defined functions. 
    for dataset in dataset_list:
        if dataset.dataset_user:
            dataset.data = requests.get(dataset.url,
                auth=(dataset.dataset_user,
                dataset.dataset_password)).content
        else:
            dataset.data = requests.get(dataset.url).content
    ###

    context = {'dataset_list': dataset_list}
    return render(request, 'datasets/portal.html', context)


#########################################################################
# It would be nice to create a function that does a dataset check, that way
# I wouldn't have to repeat the code between the create and update views. Maybe
# the code should be part of the DatasetForm

# I need to think of a good way to deal with password/username data for
# authentication with requests.

# I also need to make everything work with ajax calls



class DatasetDetailView(DetailView):
    model = Dataset

    def get_context_data(self, **kwargs):
        context = super(DatasetDetailView, self).get_context_data(**kwargs)
        if self.object.dataset_user and self.object.dataset_password:
            r = requests.get(self.object.url,
                auth=(self.object.dataset_user,
                self.object.dataset_password)).content
        else:
            r = requests.get(self.object.url).content
        context['data'] = r
        return context

    context_object_name = 'dataset'


class DatasetCreateView(CreateView):

    model = Dataset
    fields= ['author', 'title', 'url', 'dataset_user', 'dataset_password',
             'public_access', 'description']
    template_name_suffix = '_create'


class DatasetUpdateView(UpdateView):
    """
    I need to load up the map data in this view so that it is automatically
    displayed.
    """
    model = Dataset
    fields= ['author', 'title', 'url', 'dataset_user', 'dataset_password',
             'public_access', 'description']
    template_name_suffix = '_update'

    def get_context_data(self, **kwargs):
        context = super(DatasetUpdateView, self).get_context_data(**kwargs)
        r = requests.get(self.object.url).content #.decode('utf-8')
        context['data'] = r
        return context

    context_object_name = 'dataset'


class DatasetRemoveView(DeleteView):
    model = Dataset
    success_url = reverse_lazy('datasets:portal')
    context_object_name = 'dataset'
    template_name = 'datasets/dataset_confirm_remove.html'



def about(request):
    return render(request, 'datasets/about.html')

def contact(request):
    return render(request, 'datasets/contact.html')
