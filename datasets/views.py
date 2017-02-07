from django.http import Http404
from django.shortcuts import render, redirect, get_object_or_404

from datasets.models import Dataset
from datasets.forms import DatasetForm

from accounts.models import Account

# import os
# from cryptography.fernet import Fernet


def dataset_detail(request, account_slug=None, dataset_slug=None, pk=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset = get_object_or_404(Dataset, dataset_slug=dataset_slug, pk=pk)
    context = {"account": account, "dataset": dataset}
    template_name = "datasets/dataset_detail.html"
    return render(request, template_name, context)


def new_dataset(request, account_slug=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    if request.method == "POST":
        form = DatasetForm(request.POST)
        if form.is_valid():
            dataset = form.save(commit=False)
            dataset.account = account
            dataset.save()
            return redirect("accounts:account_detail",
                            account_slug=account.account_slug)
    else:
        form = DatasetForm()
    template_name = "datasets/new_dataset.html"
    return render(request,
                  template_name,
                  {"form": form,
                   "account": account})


def dataset_update(request, account_slug=None, dataset_slug=None, pk=None):
    """
    I'm back to the same problem I had before. I don't know how to save the
    password protected datasets without re-encrypting the dataset_user and
    the dataset_password.

    What I need to do is get previous instance of the dataset and compare the
    form instance to it. I should be able to do that as such:

    if dataset.dataset_password != "" and form.dataset_password == "":
       updated_dataset.dataset_password = dataset.dataset_password

    This reads 'If the old dataset_password instance is not empty, and the form
    password instance is empty, set the updated dataset dataset_password to the
    old one

    ###########################
    I figured it out! The instance includes the dataset_user and
    dataset_password. I need to remove the user and password from the dataset
    instance that is being passed to the form
    ###########################
    """
    account = get_object_or_404(Account, account_slug=account_slug)

    try:
        dataset = Dataset.objects.filter(
            pk=pk,
            dataset_slug=dataset_slug).defer(
                "dataset_user", "dataset_password")
    #    dataset = Dataset.objects.get(pk=pk)
    except Dataset.DoesNotExist:
        raise Http404("No Dataset matches to the given query")

    try:
        old = Dataset.objects.filter(
            pk=pk,
            dataset_slug=dataset_slug).only(
                "dataset_user", "datset_password")
    except Dataset.DoesNotExist:
        return None

    print(dataset)

    if request.method == "POST":
        form = DatasetForm(request.POST)#, initial=dataset)
        if form.is_valid():
            updated_dataset = form.save(commit=False)
            updated_dataset.account = account
            if old:
                if form.instance.dataset_user == "":
                    updated_dataset.dataset_user = old.dataset_user
                if form.instance.dataset_password == "":
                    updated_dataset.dataset_password = old.dataset_password
            else:
                updated_dataset.save()
            return redirect("datasets:dataset_detail",
                            account_slug=account.account_slug,
                            dataset_slug=dataset.dataset_slug,
                            pk=dataset.pk)
    else:
        form = DatasetForm(instance=dataset)
    template_name = "datasets/dataset_update.html"
    return render(request, template_name,
                  {"form": form, "account": account, "dataset": dataset})


def dataset_remove(request, account_slug=None, dataset_slug=None, pk=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset = get_object_or_404(Dataset, dataset_slug=dataset_slug, pk=pk)
    context = {"account": account, "dataset": dataset}
    template_name = "datasets/dataset_remove.html"
    if request.method == "POST":
        dataset.delete()
        return redirect("accounts:account_detail",
                        account_slug=account.account_slug)
    return render(request, template_name, context)
