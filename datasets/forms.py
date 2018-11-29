from django import forms

from datasets.models import Dataset


class DatasetCreateForm(forms.ModelForm):
    """
    This form will have all the fields that are created by the user,
    and only be used to create datasets
    """
    class Meta:
        model = Dataset

        fields = ["title", "author", "url",
                  "owncloud", "owncloud_instance", "owncloud_path",
                  "public_access", "description",
                  "dataset_user", "dataset_password"]

        widgets = {
            "dataset_user": forms.PasswordInput(),
            "dataset_password": forms.PasswordInput()
        }


class DatasetUpdateForm(forms.ModelForm):
    """
    Until after the initial deployment i am removing "dataset_user" and
    "dataset_password"
    """
    class Meta:
        model = Dataset

        fields = ["title", "author", "url",
                  "public_access", "description"]

        
class DatasetUpdateAuthForm(forms.ModelForm):
    """
    This will only update the dataset_user and the dataset_password fields
    """
    class Meta:
        model = Dataset

        fields = ["dataset_user", "dataset_password",
                  "owncloud", "owncloud_instance", "owncloud_path"]

        widgets = {
            "dataset_user": forms.PasswordInput(),
            "dataset_password": forms.PasswordInput()
        }

