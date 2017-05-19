from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render, redirect

from accounts.models import Account
from accounts.forms import AccountForm

from datasets.models import Dataset


def account_list(request):
    """
    This view will need to be searchable by account name, account affiliation,
    and other account terms.
    """
    account_list = Account.objects.all()

    # It should work fine to query by the slug. Everything will be lowercase
    # and it will remove any crazy characters... Also I think usernames can be
    # only one word long. Better check that.
    if "q" in request.GET:
        q = request.GET["q"]
        account_list = Account.objects.filter(
            account_slug__contains=q).order_by("account_slug")

    context = {"account_list": account_list}
    template_name = "accounts/account_list.html"
    return render(request, template_name, context)


def account_ajax(request, account_slug=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset_list = Dataset.objects.filter(account=account)
    template_name = "accounts/account_ajax.html"
    return render(request, template_name,
                  context={"account": account, "dataset_list": dataset_list})


@login_required
def account_update(request, account_slug=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    if request.user.id != account.user.id:
        return redirect("access_denied")
    else:
        if request.method == "POST":
            form = AccountForm(request.POST, instance=account)
            if form.is_valid():
                form.save()
                return redirect("accounts:account_detail",
                                account_slug=account.account_slug)
            else:
                return HttpResponse("Error!")
        else:
            form = AccountForm(instance=account)
        template_name = "accounts/account_update.html"
        return render(request, template_name,
                      {"account": account, "form": form})


@login_required
def account_remove(request, account_slug=None):
    # this view actually removes the user model, and everything associated
    # with it
    account = get_object_or_404(Account, account_slug=account_slug)
    if request.user.id != account.user.id:
        return redirect("access_denied")
    else:
        context = {"account": account}
        template_name = "accounts/account_remove.html"
        if request.method == 'POST':
            account.user.delete()
            return redirect('/')
        return render(request, template_name, context)


# this can probably be refactored
def account_detail(request, account_slug=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    dataset_list = Dataset.objects.filter(account=account)
    template_name = "accounts/account_detail.html"

    if "q" in request.GET:
        q = request.GET["q"]
        dataset_list = Dataset.objects.filter(
            Q(title__icontains=q) | Q(author__icontains=q)).order_by("title")

    return render(request, template_name,
                  context={"account": account, "dataset_list": dataset_list})
