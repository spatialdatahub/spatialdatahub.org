from django.shortcuts import render, redirect, get_object_or_404

from django.core.urlresolvers import reverse, reverse_lazy
from django.http import HttpResponse, Http404
from django.views.generic import ListView
from django.views.generic.edit import UpdateView, FormView

from datasets.models import Dataset
from datasets.forms import DatasetForm

from accounts.models import Account
from accounts.forms import AccountForm

import requests
import os
from cryptography.fernet import Fernet


"""
I still need to figure out a good way to deal with KML and KMZ files.
"""


def load_dataset(request, pk):
    """
    This needs to be fixed to run asynchronously, incase of a very large
    dataset
    Fix this so that it works as ajax or something.

    Also there needs to be a better way to hide the cryptokey
    """
    dataset = Dataset.objects.get(pk=pk)
    if dataset.dataset_user and dataset.dataset_password:
        # get cryptokey
        cryptokey = os.environ["CRYPTOKEY"].encode("UTF-8")
        cryptokey_fernet = Fernet(cryptokey)

        # password
        # turn convert password from string to bytes
        # decrypt the dataset_password with the key
        password_bytes = (dataset.dataset_password).encode("UTF-8")
        password_decrypted_bytes = cryptokey_fernet.decrypt(password_bytes)
        password_decrypted_string = password_decrypted_bytes.decode("UTF-8")

        # user 
        # turn convert user from string to bytes
        # decrypt the dataset_user with the key
        user_bytes = (dataset.dataset_user).encode("UTF-8")
        user_decrypted_bytes = cryptokey_fernet.decrypt(user_bytes)
        user_decrypted_string = user_decrypted_bytes.decode("UTF-8")

        # finally make the request with the authentication password and
        # username
        r = requests.get(dataset.url, auth = (
        user_decrypted_string, password_decrypted_string)).content
        data = r
    else:
        r = requests.get(dataset.url).content
        data = r
    return HttpResponse(data)


# this is going to be a function based view again. Unless I can figure out how
# to bring slugs from both models in to the class based view (why is that so
# difficult?)

class PortalView(ListView):
    """
    This is the main view on the site. It should be a simple list view without
    any special methods. Only the model, context object name and template
    should be defined. I will remove the get_queryset method and replace it
    with an ajax call function.
    """

    model = Dataset
    context_object_name = "dataset_list"
    template_name = "datasets/portal.html"

    """
    I need to figure out how to fix this so that it works with ajax and the
    context object view. As it is this is just extra work that the view has
    to do.
    """

    def get_queryset(self):
        queryset = super(PortalView, self).get_queryset()
        if "q" in self.request.GET:
            q = self.request.GET["q"]
            queryset = Dataset.objects.filter(title__icontains=q).order_by("title")
        return queryset


def account_list(request):
    account_list = Account.objects.all()
    context = {"account_list": account_list}
    template_name = "accounts/account_list.html"
    return render(request, template_name, context)


def account_detail(request, account_slug=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset_list = Dataset.objects.filter(account=account)
    context = {"account": account, "dataset_list": dataset_list}
    return render(request, "accounts/account_detail.html", context=context)


def new_account(request):
    if request.method == "POST":
        form = AccountForm(request.POST or None)
        if form.is_valid():
            form.save()
            return redirect("/")
        else:
            return HttpResponse("Error!")
    else:
        form=AccountForm()
    return render(request, "accounts/new_account.html", {"form": form})

def dataset_detail_view(request, account_slug=None, dataset_slug=None, pk=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset = get_object_or_404(Dataset, dataset_slug=dataset_slug, pk=pk)
    context = {'account': account, 'dataset': dataset}
    return render(request, "datasets/dataset_detail.html", context)



def dataset_create_view(request, account_slug=None):
    account = get_object_or_404(Account, account_slug=account_slug)

    if request.method == "POST":
        form = DatasetForm(request.POST)
        if form.is_valid():
            dataset = form.save(commit=False)
            dataset.account = account

            if form.instance.dataset_user and form.instance.dataset_password:
                # get key (I am only using one key for both password and username)
                cryptokey = os.environ["CRYPTOKEY"].encode("UTF-8")
                cryptokey_fernet = Fernet(cryptokey)

                # password
                password_bytes = (form.instance.dataset_password).encode("UTF-8")
                password_encrypted = cryptokey_fernet.encrypt(password_bytes)
                form.instance.dataset_password = password_encrypted.decode("UTF-8")

                # username
                user_bytes = (form.instance.dataset_user).encode("UTF-8")
                user_encrypted = cryptokey_fernet.encrypt(user_bytes)
                form.instance.dataset_user = user_encrypted.decode("UTF-8")
            form.save()
            return redirect(reverse("datasets:account_detail",
                kwargs={"account_slug": account.account_slug}))
    else:
        form = DatasetForm()

    template_name = "datasets/new_dataset.html"
    return render(request,
                  template_name,
                  {"form": form,
                  "account": account})

class DatasetCreateView(FormView):
    """
    I need to have a method that encrypts the dataset_user and dataset_password
    fields the same method should be useable on the update view
    """

    form_class = DatasetForm
    template_name = "datasets/new_dataset.html"
    success_url = "/"

    # how do i save the model with a specific account?

    # can I move this to the form itself?
    def form_valid(self, form):
        # I can get the user this way, but how do i pass the account to the
        # form and model before saving it? Do i set it as a hidden field?

#        form.instance.account = self.request.account

        if form.instance.dataset_user and form.instance.dataset_password:
            # get key (I am only using one key for both password and username)
            cryptokey = os.environ["CRYPTOKEY"].encode("UTF-8")
            cryptokey_fernet = Fernet(cryptokey)

            # password
            password_bytes = (form.instance.dataset_password).encode("UTF-8")
            password_encrypted = cryptokey_fernet.encrypt(password_bytes)
            form.instance.dataset_password = password_encrypted.decode("UTF-8")

            # username
            user_bytes = (form.instance.dataset_user).encode("UTF-8")
            user_encrypted = cryptokey_fernet.encrypt(user_bytes)
            form.instance.dataset_user = user_encrypted.decode("UTF-8")

        form.save()

        return super(DatasetCreateView, self).form_valid(form)


# I need to make this into a function based view I think
class DatasetUpdateView(UpdateView):
    """
    This is the view that will allow a user to modify a dataset's meta data and
    url. The map will be autopopulated with the dataset on page load.
    The page load will use the same ajax call as that the portal page uses.
    """

    model = Dataset
    form_class = DatasetForm
    context_object_name = "dataset"
    template_name = "datasets/dataset_update.html"

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        self.object.initial_dataset_password = self.object.dataset_password
        return super(DatasetUpdateView, self).get(request, self, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        self.old_password = self.object.dataset_password
        self.old_user = self.object.dataset_user
        return super(DatasetUpdateView, self).post(request, *args, **kwargs)

    def form_valid(self, form):
#        form.instance.account = self.request.user.account

        # double if statements here.
        if form.instance.dataset_user and form.instance.dataset_password:

            if form.instance.dataset_password != self.old_password:
                cryptokey = os.environ["CRYPTOKEY"].encode("UTF-8")
                cryptokey_fernet = Fernet(cryptokey)
                password_bytes = (form.instance.dataset_password).encode("UTF-8")
                password_encrypted = cryptokey_fernet.encrypt(password_bytes)
                form.instance.dataset_password = password_encrypted.decode("UTF-8")

            if form.instance.dataset_user != self.old_user:
                cryptokey = os.environ["CRYPTOKEY"].encode("UTF-8")
                cryptokey_fernet = Fernet(cryptokey)
                user_bytes = (form.instance.dataset_user).encode("UTF-8")
                user_encrypted = cryptokey_fernet.encrypt(user_bytes)
                form.instance.dataset_user = user_encrypted.decode("UTF-8")

        return super(DatasetUpdateView, self).form_valid(form)




def dataset_remove_view(request, account_slug=None, dataset_slug=None, pk=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset = get_object_or_404(Dataset, dataset_slug=dataset_slug, pk=pk)
    context = {"account": account, "dataset": dataset}
    template_name = "datasets/dataset_remove.html"
    if request.method =='POST':
        dataset.delete()
        return redirect('/')
    return render(request, template_name, context)
