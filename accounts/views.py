from django.shortcuts import get_object_or_404, render

from accounts.models import Account
from accounts.forms import AccountForm

from datasets.models import Dataset


def new_account(request):
    template_name = "accounts/new_account.html"
    if request.method == "POST":
        form = AccountForm(request.POST or None)
        if form.is_valid():
            form.save()
            return redirect("/")
        else:
            return HttpResponse("Error!")
    else:
        form=AccountForm()
    return render(request, template_name, {"form": form})


def account_list(request):
    """
    This view will need to be searchable by account name, account affiliation,
    and other account terms.
    """
    account_list = Account.objects.all()
    context = {"account_list": account_list}
    template_name = "accounts/account_list.html"
    return render(request, template_name, context)


def account_update(request, account_slug=None):
    pass


def account_remove(request, account_slug=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    context = {"account": account}
    template_name = "accounts/account_remove.html"
    if request.method =='POST':
        account.delete()
        return redirect('/')
    return render(request, template_name, context)


def account_detail(request, account_slug=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset_list = Dataset.objects.filter(account=account)
    context = {"account": account, "dataset_list": dataset_list}
    template_name = "accounts/account_detail.html"
    return render(request, template_name, context)

