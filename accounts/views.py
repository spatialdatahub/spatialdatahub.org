from django.contrib.auth import login, logout, get_user_model
from django.http import HttpResponseRedirect
from django.shortcuts import render, reverse

from .forms import UserCreationForm, UserLoginForm

User = get_user_model()


def test_login(request):
    return render(request, "accounts/test_login.html", {})


def register(request, *args, **kwargs):
    form = UserCreationForm(request.POST or None)
    if form.is_valid():
        form.save()
        return HttpResponseRedirect(reverse("accounts:login"))
    return render(request, "accounts/register.html", {"form": form})


def login_view(request, *args, **kwargs):
    form = UserLoginForm(request.POST or None)
    if form.is_valid():
        user_obj = form.cleaned_data.get("user_obj")
        login(request, user_obj)
        return HttpResponseRedirect(reverse("datasets:portal"))
    return render(request, "accounts/login.html", {"form": form})


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("accounts:login"))
