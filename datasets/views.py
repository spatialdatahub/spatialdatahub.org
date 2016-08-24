from django.core.urlresolvers import reverse_lazy
from django.views.generic import DetailView, TemplateView, ListView
from django.views.generic.edit import CreateView, DeleteView, UpdateView

from datasets.models import Dataset

import requests

from django.shortcuts import render
from django.http import HttpResponse, Http404


"""
Making big change:
I still need to figure out a good way to deal with KML and KMZ files.

Dealing with passwords and usernames is frustrating, I need a better
way of making sure that they are secure.
"""


def ajax_load_dataset(request, pk):
    """
    This will be a function that loads the datasets to the leafletjs map
    background on button click, instead on initial page load.
    """
    dataset = Dataset.objects.get(pk=pk)
    if request.is_ajax():
        r = requests.get(dataset.url).content
        message=r
    else:
        message="no"
    return HttpResponse(message)


class Playground(TemplateView):
    template_name="datasets/playground.html"




class PortalView(ListView):
    model = Dataset
    context_object_name = 'dataset_list'
    template_name = 'datasets/portal.html'

    def get_queryset(self):
        queryset = super(PortalView, self).get_queryset()

        if 'q' in self.request.GET:
            q = self.request.GET['q']
            queryset = Dataset.objects.filter(title__icontains=q).order_by('title')

        for dataset in queryset:
            if dataset.dataset_user and dataset.dataset_password:
                dataset.data = requests.get(dataset.url,
                    auth=(dataset.dataset_user,
                    dataset.dataset_password)).content
            else:
                dataset.data = requests.get(dataset.url).content

        return queryset



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


class AboutView(TemplateView):
    template_name="datasets/about.html"


class ContactView(TemplateView):
    template_name="datasets/contact.html"
