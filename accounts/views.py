from django.views.generic import TemplateView
from django.core.urlresolvers import reverse
from django.shortcuts import render, get_object_or_404

from .models import Account

def account_view(request, account_slug=None):
    account = get_object_or_404(Account, account_slug=account_slug)
    context = {"account": account}
    return render(request, "accounts/account_view.html", context=context)
