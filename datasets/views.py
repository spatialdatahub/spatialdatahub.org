from django.core import serializers
from django.core.urlresolvers import reverse, reverse_lazy
from django.shortcuts import render
from django.views.generic.edit import CreateView, UpdateView, DeleteView

from datasets.models import Dataset

import requests
import json


def portal(request):
    """
    display template with progressively more items.

    I want to make url requests from python so that passwords and usernames
    never have to be passed to the templates, but I can't make calls for dataset
    access and add the results to the model items.
    """
    error = False
    dataset_list = Dataset.objects.all().order_by('title')
    if 'q' in request.GET:
        q = request.GET['q']
        dataset_list = Dataset.objects.filter(title__icontains=q).order_by('title')

    serialized_dataset_list = serializers.serialize('json', dataset_list)
    serialized_dataset_list = json.loads(serialized_dataset_list)
    for dataset in serialized_dataset_list:
        if dataset['fields']['dataset_user'] != '' and dataset['fields']['dataset_password'] != '':
            dataset['fields']['json'] = requests.get(dataset['fields']['url'],
                                                     auth=(dataset['fields']['dataset_user'],
                                                           dataset['fields']['dataset_password'])).json()
            dataset['fields']['dataset_user']=''
            dataset['fields']['dataset_password']=''

    context = {'dataset_list': serialized_dataset_list}
    return render(request, 'datasets/portal.html', context)


def dataset_detail(request, slug, pk):
    """
    This page will have all data entered by the people linking datasets to this program. This page will
    also have a link for a dataset specific map that is embedable. It will use the dataset's slug and id
    as the url building blocks.
    """
    dataset = Dataset.objects.get(pk=pk, slug=slug)

    context =  {'dataset':dataset}
    return render(request, 'datasets/dataset_detail.html', context)


#########################################################################
class DatasetCreate(CreateView):
    model = Dataset
    fields = ['author', 'title', 'description',
              'url', 'dataset_user', 'dataset_password',
              'public_access']
    template_name_suffix = '_create'


class DatasetUpdate(UpdateView):
    model = Dataset
    fields = ['author', 'title', 'description',
              'url', 'dataset_user', 'dataset_password',
              'public_access']
    template_name_suffix = '_update'


class DatasetDelete(DeleteView):
    model = Dataset
    success_url = reverse_lazy('datasets:portal')
#########################################################################
