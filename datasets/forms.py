from django import forms
from datasets.models import Dataset

class DatasetForm(forms.ModelForm):
    class Meta:
        model = Dataset
        fields = ["title", "author", "url", "dataset_user", "dataset_password",
                  "public_access", "description"]
        basic_input_class = {"class": "form-control"}
        widgets = {
            "title": forms.TextInput(attrs=basic_input_class),
            "author": forms.TextInput(attrs=basic_input_class),
            "url": forms.TextInput(attrs=basic_input_class),
            "dataset_user": forms.PasswordInput(attrs=basic_input_class),
            "dataset_password": forms.PasswordInput(attrs=basic_input_class),
            "description": forms.Textarea(attrs=basic_input_class)
        }
