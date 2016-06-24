from django import forms
from django.core.urlresolvers import reverse_lazy
from django.shortcuts import render, redirect
from django.views.generic.edit import DeleteView

from datasets.models import Dataset
from datasets.forms import DatasetForm
from datasets.serializers import dataset_model_serializer

import requests
import json


"""
The dataset serializer has been moved to a different file. I will probably
have to do a bunch more work in this file when I bring in User objects.

I still need to figure out a good way to deal with KML and KMZ files.

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
    # error = False
    dataset_list = Dataset.objects.all().order_by('title')

    ### Do I need this queryset thing here? Can I just write something in
    ### javascript that does it for me?
    if 'q' in request.GET:
        q = request.GET['q']
        dataset_list = Dataset.objects.filter(title__icontains=q).order_by('title')
    ###

    serialized_dataset_list = dataset_model_serializer(dataset_list)

    context = {'dataset_list': serialized_dataset_list}
    return render(request, 'datasets/portal.html', context)


def dataset_detail(request, slug, pk):
    """
    This page will have all data entered by the people linking datasets to this program. This page will
    also have a link for a dataset specific map that is embedable. It will use the dataset's slug and id
    as the url building blocks.
    """

    dataset = Dataset.objects.filter(pk=pk, slug=slug)

    # Things get a little hacky here, but to deal with serializers there needs
    # to be a queryset, so filter, which returns a queryset is used instead of
    # get, and then we have to select the first item in the serialized list to
    # pass it to the template without having to write a for loop in the
    # template.

    serialized_dataset = dataset_model_serializer(dataset)
    serialized_dataset = serialized_dataset[0]
    context = {'dataset': serialized_dataset}

    return render(request, 'datasets/dataset_detail.html', context)



#########################################################################
# It would be nice to create a function that does a dataset check, that way
# I wouldn't have to repeat the code between the create and update views. Maybe
# the code should be part of the DatasetForm

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
    return render(request, 'datasets/dataset_update.html', {'form':form})

def dataset_remove(request, slug, pk):
    """
    I don't really like the class based delete view. I want to see all the
    different moving parts, that way it will be easier to see how to call
    them in the template.
    """
    # Get specific dataset instance
    dataset = Dataset.objects.get(slug=slug, pk=pk)

    if request.method == "POST":
        form = DatasetForm(request.POST, instance=dataset)
        if form.is_valid():
            dataset=form.save(commit=False)

    # Check to see that this really is a POST request
    if request.method == "POST":
        dataset.delete()
        return redirect('datasets:portal')
    else:
        return 'error'

    return render(request,
                  'datasets/dataset_confirm_remove.html',
                  {'dataset':dataset})


class DatasetRemove(DeleteView):
    """
    I need to have a bit more control over this view, it allows the secret
    password and the secret user name to be passed through to it.
    """

    model = Dataset
    success_url = reverse_lazy('datasets:portal')
    template_name_suffix = '_confirm_remove'

#    def get_context_data(self, **kwargs):

#        context = super(DatasetRemove, self).get_context_data(**kwargs)
#        return context


#########################################################################
