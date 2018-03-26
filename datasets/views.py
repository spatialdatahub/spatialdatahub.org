from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404

from accounts.models import Account

from datasets.models import Dataset
from datasets.forms import DatasetCreateForm
from datasets.forms import DatasetUpdateForm
from datasets.forms import DatasetUpdateAuthForm

from keywords.models import Keyword


def dataset_detail(request, account_slug=None, dataset_slug=None):
    '''
    In this view I bring in the account and the dataset, and I check to see
    if the dataset is protected by password and username, meaning I will have
    to make the ajax call to the /load_dataset/<pk>/ view. If I don't have to
    do this, I can just use a plain old XMLHttpRequest to get the data, which
    should be faster than getting it through the server.
    '''
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset = get_object_or_404(Dataset, dataset_slug=dataset_slug, account=account)
    keyword_list = dataset.keywords.all()

    context = {"account": account,
               "keyword_list": keyword_list,
               "dataset": dataset}
    template_name = "datasets/dataset_detail.html"
    return render(request, template_name, context)


# can I make a functional view with cors headers?
def embed_dataset(request, account_slug=None, dataset_slug=None):
    '''
    In this view I bring in the account and the dataset, and I check to see
    if the dataset is protected by password and username, meaning I will have
    to make the ajax call to the /load_dataset/<pk>/ view. If I don't have to
    do this, I can just use a plain old XMLHttpRequest to get the data, which
    should be faster than getting it through the server.
    '''
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset = get_object_or_404(Dataset, dataset_slug=dataset_slug, account=account)
    keyword_list = dataset.keywords.all()

    context = {"account": account,
               "keyword_list": keyword_list,
               "dataset": dataset}
    template_name = "datasets/embed_dataset.html"
    response = render(request, template_name, context)

    # here's the important part
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response["Access-Control-Max-Age"] = "43200"
    response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"
    # this is hacky and probably won't work in the end.
    # there should be a better way. How does youtube or google.maps do this?
    #response["X-Frame-Options"] = "ALLOW-FROM http://www.leibniz-zmt.de/"
    response["X-Frame-Options"] = "ALLOW-FROM https://s3.eu-central-1.amazonaws.com/spatialdatahub-embed-test/"
            
    return response


# is this view used anywhere?
def dataset_ajax(request, account_slug=None, pk=None):
    dataset = get_object_or_404(Dataset, pk=pk)
    template_name = "datasets/dataset_ajax.html"
    return render(request, template_name, {"dataset": dataset})


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
                return redirect("datasets:dataset_detail",
                                account_slug=account.account_slug,
                                dataset_slug=dataset.dataset_slug)

        else:
            form = DatasetCreateForm()
            template_name = "datasets/new_dataset.html"
        return render(request,
                      template_name,
                      {"form": form,
                       "account": account})


'''
should the add keyword to dataset and remove keyword from dataset views be
in the keywords app?
'''

@login_required
def add_keyword_to_dataset(request, account_slug=None, dataset_slug=None):
    """ This works. It associates a keyword with a dataset, and if the keyword
        already exists, it simply gets that keyword and associates it with the
        dataset.

        Should this be in the keywords app? I now have to add a remove keywords from
        dataset page as well.
    """
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset = get_object_or_404(Dataset, dataset_slug=dataset_slug, account=account)
    if "kw" in request.POST:
        kw = request.POST["kw"]
        # this isn't working. I think that get or create is not meant for many to many
        # stuff. What is happening is if the keyword already exists in the database,
        # the get or create is failing, becaues it's checking against the keywords
        # associated with the datset, and not the database. So it tries to make the
        # keyword, but then the process fails because of unique keyword constraints.

        # This needs an if statement that checks if the keyword already exists, and
        # if it doesn't, create it and associate it with the dataset
        # if it does just associate it with the dataset
        keyword_lower = kw.lower()

        try:
            n = Keyword.objects.get(keyword=keyword_lower)
            dataset.keywords.add(n)
        except ObjectDoesNotExist:
            dataset.keywords.create(keyword=keyword_lower)

        return redirect("datasets:dataset_detail",
                        account_slug=account.account_slug,
                        dataset_slug=dataset.dataset_slug)
    
    context = {"account": account, "dataset": dataset}
    template_name = "datasets/add_keyword_to_dataset.html"
    return render(request, template_name, context)

@login_required
def remove_keyword_from_dataset(request, account_slug=None, dataset_slug=None):
    """ This works. It associates a keyword with a dataset, and if the keyword
        already exists, it simply gets that keyword and associates it with the
        dataset.

        Should this be in the keywords app? I now have to add a remove keywords from
        dataset page as well.
    """
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset = get_object_or_404(Dataset, dataset_slug=dataset_slug, account=account)
    keyword_list = dataset.keywords.all()
    # I don't like this... how can I do it better?
    if "kw" in request.POST:
        kw = request.POST["kw"]
        dataset.keywords.remove(kw)
        return redirect("datasets:dataset_detail",
                        account_slug=account.account_slug,
                        dataset_slug=dataset.dataset_slug)
    
    context = {"account": account, "dataset": dataset, "keyword_list": keyword_list}
    template_name = "datasets/remove_keyword_from_dataset.html"
    return render(request, template_name, context)




@login_required
def dataset_update(request, account_slug=None, dataset_slug=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset = get_object_or_404(Dataset, dataset_slug=dataset_slug, account=account)
    if request.user.id != account.user.id:
        return redirect("access_denied")
    else:
        if request.method == "POST":
            form = DatasetUpdateForm(request.POST, instance=dataset)
            if form.is_valid():
                updated_dataset = form.save(commit=False)
                updated_dataset.account = account
                updated_dataset.save(update_fields=[
                    "title", "author", "url",
                    "public_access", "description",
                    "dataset_slug"])

            return redirect("datasets:dataset_detail",
                            account_slug=account.account_slug,
                            dataset_slug=dataset.dataset_slug)
        else:
            form = DatasetUpdateForm(instance=dataset)
            template_name = "datasets/dataset_update.html"
        return render(request, template_name,
                      {"form": form,
                       "account": account,
                       "dataset": dataset})


@login_required
def dataset_update_auth(request, account_slug=None,
                        dataset_slug=None, pk=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset = get_object_or_404(Dataset, dataset_slug=dataset_slug, pk=pk)
    if request.user.id != account.user.id:
        return redirect("access_denied")
    else:
        if request.method == "POST":
            form = DatasetUpdateAuthForm(request.POST, instance=dataset)
            if form.is_valid():
                updated_dataset = form.save(commit=False)
                updated_dataset.account = account
                updated_dataset.save()

            return redirect("datasets:dataset_detail",
                            account_slug=account.account_slug,
                            dataset_slug=dataset.dataset_slug)
        else:
            form = DatasetUpdateAuthForm(instance=dataset)
            template_name = "datasets/dataset_update_auth.html"
        return render(request, template_name,
                      {"form": form,
                       "account": account,
                       "dataset": dataset})


@login_required
def dataset_remove(request, account_slug=None, dataset_slug=None, pk=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset = get_object_or_404(Dataset, dataset_slug=dataset_slug, pk=pk)
    context = {"account": account, "dataset": dataset}
    template_name = "datasets/dataset_remove.html"
    if request.user.id != account.user.id:
        return redirect("access_denied")
    else:
        if request.method == "POST":
            dataset.delete()
            return redirect("accounts:account_detail",
                            account_slug=account.account_slug)
        return render(request, template_name, context)
