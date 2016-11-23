from django.shortcuts import render, redirect, get_object_or_404

from django.core.urlresolvers import reverse, reverse_lazy
from django.views.generic.edit import UpdateView, FormView

from datasets.models import Dataset
from datasets.forms import DatasetForm

from accounts.models import Account
from accounts.forms import AccountForm

import os
from cryptography.fernet import Fernet


"""
I still need to figure out a good way to deal with KML and KMZ files.
"""





def dataset_detail(request, account_slug=None, dataset_slug=None, pk=None):
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
            return redirect(reverse("accounts:account_detail",
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




def dataset_remove(request, account_slug=None, dataset_slug=None, pk=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset = get_object_or_404(Dataset, dataset_slug=dataset_slug, pk=pk)
    context = {"account": account, "dataset": dataset}
    template_name = "datasets/dataset_remove.html"
    if request.method =='POST':
        dataset.delete()
        return redirect('/')
    return render(request, template_name, context)
