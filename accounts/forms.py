from django import forms

from accounts.models import Account


class AccountForm(forms.ModelForm):
    class Meta:
        model = Account
        fields = ["affiliation"]
        basic_input_class = {"class": "form-control"}
        widgets = {
            "affiliation": forms.TextInput(attrs=basic_input_class)
        }
