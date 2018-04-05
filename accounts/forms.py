from django import forms

from accounts.models import Account


class AccountForm(forms.ModelForm):
    class Meta:
        model = Account
        fields = ["affiliation"]
