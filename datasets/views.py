from django import forms
from django.core.urlresolvers import reverse_lazy
from django.shortcuts import render, redirect
from django.views.generic import DetailView
from django.views.generic.edit import CreateView, DeleteView, UpdateView

from datasets.models import Dataset
from datasets.forms import DatasetForm
from datasets.serializers import dataset_model_serializer

import requests
import json


"""
Making big change:
    Removing serializer from the project.

The dataset serializer has been moved to a different file. I will probably
have to do a bunch more work in this file when I bring in User objects.

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



def requeststojstest(request):
#    bienvenidos='https://raw.githubusercontent.com/zmtdummy/GeoJsonData/master/bienvenidos.json'
    simpleline='https://raw.githubusercontent.com/zmtdummy/GeoJsonData/master/simpleline.json'

    kml_url='https://raw.githubusercontent.com/zmtdummy/GeoJsonData/master/westcampus.kml'

#    bienvenidos=requests.get(bienvenidos).json()

    simpleline=requests.get(simpleline).json()
#    simpleline = list(simpleline)

    kml_data = requests.get(kml_url).content.decode('utf-8')

    data = {"data":{"kml":kml_data, "simpleline":simpleline}}

    context = {'data': data}

    return render(request, 'datasets/requeststojstest.html', context)


class DatasetDetailView(DetailView):
    model = Dataset

    def get_context_data(self, **kwargs):
        context = super(DatasetDetailView, self).get_context_data(**kwargs)
        r = requests.get(self.object.url).content# .decode('utf-8')
        context['data'] = r
        return context

    context_object_name = 'dataset'


#########################################################################
# It would be nice to create a function that does a dataset check, that way
# I wouldn't have to repeat the code between the create and update views. Maybe
# the code should be part of the DatasetForm


class DatasetCreateView(CreateView):
    """
    Test this out.
    Having serious difficulty with the get context data method, going to try it
    out on a detail view first
    """
    model = Dataset
    fields= ['author', 'title', 'url', 'dataset_user', 'dataset_password',
             'public_access', 'description']
    template_name_suffix = '_create'


class DatasetUpdateView(UpdateView):
    """
    I don't mind dealing with this view if I can figure out how to (1) block the
    dataset and password from being accessible, and (2) make validation errors if
    the dataset url status codes are not 200.

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


#########################################################################
'''
More or less static views here, no logic required.
'''

def about(request):
    return render(request, 'datasets/about.html')

def contact(request):
    return render(request, 'datasets/contact.html')
