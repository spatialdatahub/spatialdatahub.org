from django.shortcuts import render, redirect, get_object_or_404

from datasets.models import Dataset
from datasets.forms import DatasetForm

from accounts.models import Account

import os
from cryptography.fernet import Fernet


"""
I still need to figure out a good way to deal with KML and KMZ files.
"""


def dataset_detail(request, account_slug=None, dataset_slug=None, pk=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset = get_object_or_404(Dataset, dataset_slug=dataset_slug, pk=pk)
    context = {"account": account, "dataset": dataset}
    template_name = "datasets/dataset_detail.html"
    return render(request, template_name, context)


def dataset_create_view(request, account_slug=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    if request.method == "POST":
        form = DatasetForm(request.POST)
        if form.is_valid():
            dataset = form.save(commit=False)
            dataset.account = account

            if dataset.dataset_user and dataset.dataset_password:
                # get key (I am only using one key for both password and username)
                cryptokey = os.environ["CRYPTOKEY"].encode("UTF-8")
                cryptokey_fernet = Fernet(cryptokey)

                # password
                password_bytes = (dataset.dataset_password).encode("UTF-8")
                password_encrypted = cryptokey_fernet.encrypt(password_bytes)
                dataset.dataset_password = password_encrypted.decode("UTF-8")

                # username
                user_bytes = (dataset.dataset_user).encode("UTF-8")
                user_encrypted = cryptokey_fernet.encrypt(user_bytes)
                dataset.dataset_user = user_encrypted.decode("UTF-8")
            dataset.save()
            return redirect("accounts:account_detail", account_slug=account.account_slug)
    else:
        form = DatasetForm()
    template_name = "datasets/new_dataset.html"
    return render(request,
                  template_name,
                  {"form": form,
                  "account": account})



def dataset_update(request, account_slug=None, dataset_slug=None, pk=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset = get_object_or_404(Dataset, dataset_slug=dataset_slug, pk=pk)
    if request.method == "POST":
        form = DatasetForm(request.POST, instance=dataset)
        if form.is_valid():
            updated_dataset = form.save(commit=False)
            updated_dataset.account = account

            if updated_dataset.dataset_user and updated_dataset.dataset_password:
                cryptokey = os.environ["CRYPTOKEY"].encode("UTF-8")
                cryptokey_fernet = Fernet(cryptokey)

                if updated_dataset.dataset_password != dataset.dataset_password:
                    password_bytes = (updated_dataset.dataset_password).encode("UTF-8")
                    password_encrypted = cryptokey_fernet.encrypt(password_bytes)
                    updated_dataset.dataset_password = password_encrypted.decode("UTF-8")

                if updated_datset.dataset_user != dataset.dataset_user:
                    user_bytes = (updated_dataset.dataset_user).encode("UTF-8")
                    user_encrypted = cryptokey_fernet.encrypt(user_bytes)
                    updated_dataset.dataset_user = user_encrypted.decode("UTF-8")

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
    if request.method =="POST":
        dataset.delete()
        return redirect("portal")
    return render(request, template_name, context)
