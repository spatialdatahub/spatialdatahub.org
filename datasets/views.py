from django import forms
from django.core import serializers
from django.core.urlresolvers import reverse, reverse_lazy
from django.shortcuts import render, redirect
from django.views.generic.edit import UpdateView, DeleteView

from datasets.models import Dataset
from datasets.forms import DatasetForm

import requests
import json


"""
Is there a good way to serialize all information before it actually
passes to the views? I suppose I could try out DjangoRESTFramework,
but that would require refactoring everything and learning a new
framework. I just want to have serialized data to deal with for all
views.

It's a huge pain to serialize datasets in every view. I just wonder
how everything will go with kml and kmz files. I suppose that all
the data I keep here are addresses... but what if someone needs to
connect password protected kml and kmz urls to the database?

Dealing with passwords and usernames is frustrating, I need a better
way of making sure that they are secure.
"""


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

    serialized_dataset = json.loads(serializers.serialize('json', [dataset, ]))
    serialized_dataset = serialized_dataset[0]
    if serialized_dataset['fields']['dataset_user'] != '' and serialized_dataset['fields']['dataset_password'] != '':
        serialized_dataset['fields']['json'] = requests.get(serialized_dataset['fields']['url'],
                                                 auth=(serialized_dataset['fields']['dataset_user'],
                                                       serialized_dataset['fields']['dataset_password'])).json()
        serialized_dataset['fields']['dataset_user']=''
        serialized_dataset['fields']['dataset_password']=''

    context = {'dataset': serialized_dataset}

    return render(request, 'datasets/dataset_detail.html', context)




def kml_test(request):
    """
    This page is here simply to test kml file loading.

    It turns out that the google maps function 'google.maps.KmlLayer'
    can deal with both kml and kmz files. This means that it is not neccesary
    to do any extra work
    unzipping the kmz files, or specifying that they are infact kmz files.

    There simply needs to be a way to designate the files as kml/kmz.
    """
    return render(request, 'datasets/kml_test.html')


#########################################################################
# I will probably be changing these to function based views that use a
# modelform. This should allow me to implement data more checking mechanisms.
# or maybe I can just implement the extra checks with the form_valid() call.

"""
This dataset creation view (1) checks for a username and password for the url,
it checks whether the url is valid, then (2)it checks whether the url with the
password and username returns a positive status code. In the case that the
dataset url does not need a username and password it checks (3) that the url
returns a positive status code.

The next step is to add a file extension checker. This will determine how the
dataset is handled by the view and JavaScript functions. Something for KML and
KMZ files.
"""

def dataset_create(request):
    if request.method == "POST":
        form = DatasetForm(request.POST)
        if form.is_valid():
            dataset = form.save(commit=False)
            # 1
            if dataset.dataset_user != "" and dataset.dataset_password != "":
                r = requests.get(dataset.url,
                                 auth=(dataset.dataset_user, dataset.dataset_password))
                # 2
                if r.status_code == 200:
                    dataset.save()
                    return redirect('datasets:dataset_detail', slug=dataset.slug, pk=dataset.pk)
                else:
                    raise forms.ValidationError('Check your dataset url, username and password; ' +
                                            'there seems to be an error')
            else:
                r = requests.get(dataset.url)
            # 3
                if r.status_code == 200:
                    dataset.save()
                    return redirect('datasets:dataset_detail', slug=dataset.slug, pk=dataset.pk)
                else:
                    raise forms.ValidationError('Check your dataset url, username and password; ' +
                                                'there seems to be an error')
        else:
            raise forms.ValidationError('There seems to be an error.')
    else:
        form = DatasetForm()
    return render(request, 'datasets/dataset_create.html', {'form':form})

def dataset_update(request, slug, pk):
    """
#    This view gets the specific dataset instance, then does the same thing as the create view,
#    with the data from that instance.

#    This dataset creation view (1) checks for a username and password for the url,
#    it checks whether the url is valid, then (2)it checks whether the url with the
#    password and username returns a positive status code. In the case that the
#    dataset url does not need a username and password it checks (3) that the url
#    returns a positive status code.
    """


    # Get specific dataset instance
    dataset = Dataset.objects.get(slug=slug, pk=pk)

    # Check to see that this really is a POST request
    if request.method == "POST":
        form = DatasetForm(request.POST, instance=dataset)
        if form.is_valid():
            dataset=form.save(commit=False)
            # 1
            if dataset.dataset_user != "" and dataset.dataset_password != "":
                r = requests.get(dataset.url,
                                 auth=(dataset.dataset_user, dataset.dataset_password))
                # 2
                if r.status_code == 200:
                    dataset.save()
                    return redirect('datasets:dataset_detail', slug=dataset.slug, pk=dataset.pk)
                else:
                    raise forms.ValidationError('Check your dataset url, username and password; ' +
                                            'there seems to be an error')
            else:
                r = requests.get(dataset.url)
            # 3
                if r.status_code == 200:
                    dataset.save()
                    return redirect('datasets:dataset_detail', slug=dataset.slug, pk=dataset.pk)
                else:
                    raise forms.ValidationError('Check your dataset url, username and password; ' +
                                                'there seems to be an error')
        else:
            raise forms.ValidationError('There seems to be an error.')
    else:
        form = DatasetForm()
    return render(request, 'datasets/dataset_create.html', {'form':form})

"""
class DatasetUpdate(UpdateView):
    model = Dataset
    fields = ['author', 'title', 'description',
              'url', 'dataset_user', 'dataset_password',
              'public_access']
    template_name_suffix = '_update'
"""

class DatasetDelete(DeleteView):
    model = Dataset
    success_url = reverse_lazy('datasets:portal')
#########################################################################
