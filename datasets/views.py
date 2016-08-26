from django.core.urlresolvers import reverse_lazy
from django.http import HttpResponse, Http404
from django.views.generic import DetailView, TemplateView, ListView
from django.views.generic.edit import CreateView, DeleteView, UpdateView

from datasets.models import Dataset

import requests



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
        raise Http404


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
