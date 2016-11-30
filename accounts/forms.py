from django import forms

from accounts.models import Account


class AccountForm(forms.ModelForm):
    class Meta:
        model = Account
        fields = ["user", "affiliation"]
        basic_input_class = {"class": "form-control"}
        widgets = {
            "user": forms.TextInput(attrs=basic_input_class),
            "affiliation": forms.TextInput(attrs=basic_input_class)
        }
