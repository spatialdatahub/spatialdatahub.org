from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.shortcuts import render, redirect, get_object_or_404

from datasets.models import Dataset
from datasets.forms import DatasetCreateForm
from datasets.forms import DatasetUpdateForm
from datasets.forms import DatasetUpdateAuthForm

from accounts.models import Account


def dataset_detail(request, account_slug=None, dataset_slug=None, pk=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset = get_object_or_404(Dataset, dataset_slug=dataset_slug, pk=pk)
    context = {"account": account, "dataset": dataset}
    template_name = "datasets/dataset_detail.html"
    return render(request, template_name, context)

@login_required
def new_dataset(request, account_slug):
    account = get_object_or_404(Account, account_slug=account_slug)
    if request.user.id != account.user.id:
        return redirect("access_denied")
    else:
        if request.method == "POST":
            form = DatasetCreateForm(request.POST)
            if form.is_valid():
                dataset = form.save(commit=False)
                dataset.account = account
                dataset.save()
                return redirect("accounts:account_detail",
                            account_slug=account.account_slug)
        else:
            form = DatasetCreateForm()
        template_name = "datasets/new_dataset.html"
        return render(request,
                  template_name,
                  {"form": form,
                   "account": account})

def dataset_update(request, account_slug=None, dataset_slug=None, pk=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset = get_object_or_404(Dataset, dataset_slug=dataset_slug, pk=pk)

    if request.method == "POST":
        form = DatasetUpdateForm(request.POST, instance=dataset)
        if form.is_valid():
            updated_dataset = form.save(commit=False)
            updated_dataset.account = account
            updated_dataset.save(update_fields=["title", "author", "url",
                  "public_access", "description", "dataset_slug"])

        return redirect("datasets:dataset_detail",
                        account_slug=account.account_slug,
                        dataset_slug=dataset.dataset_slug,
                        pk=dataset.pk)
    else:
        form = DatasetUpdateForm(instance=dataset)
    template_name = "datasets/dataset_update.html"
    return render(request, template_name,
                  {"form": form,
                   "account": account,
                   "dataset": dataset})

def dataset_update_auth(request, account_slug=None, dataset_slug=None, pk=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset = get_object_or_404(Dataset, dataset_slug=dataset_slug, pk=pk)

    if request.method == "POST":
        form = DatasetUpdateAuthForm(request.POST, instance=dataset)
        if form.is_valid():
            updated_dataset = form.save(commit=False)
            updated_dataset.account = account
            updated_dataset.save()

        return redirect("datasets:dataset_detail",
                        account_slug=account.account_slug,
                        dataset_slug=dataset.dataset_slug,
                        pk=dataset.pk)
    else:
        form = DatasetUpdateAuthForm(instance=dataset)
    template_name = "datasets/dataset_update_auth.html"
    return render(request, template_name,
                  {"form": form,
                   "account": account,
                   "dataset": dataset})

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
