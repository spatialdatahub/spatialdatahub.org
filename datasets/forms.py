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

        basic_input_class = "form-control"

        widgets = {
            "title": forms.TextInput(attrs={"class": basic_input_class}),
            "author": forms.TextInput(attrs={"class": basic_input_class}),
            "url": forms.TextInput(
                attrs={"class": basic_input_class,
                       "placeholder": "For example: https://dataset.geojson"}),
            "owncloud_instance": forms.TextInput(
                attrs={"class": basic_input_class,
                       "placeholder": "For example: https://zmtcloud.leibniz-zmt.de/"}),
            "owncloud_path": forms.TextInput(
                attrs={"class": basic_input_class,
                       "placeholder": "For example: TestFolder/ownCloudPoint.kml"}),
            "description": forms.Textarea(attrs={"class": basic_input_class, "rows": 4}),
            "dataset_user": forms.PasswordInput(attrs={"class": basic_input_class}),
            "dataset_password": forms.PasswordInput(attrs={"class": basic_input_class})
        }


class DatasetUpdateForm(forms.ModelForm):
    """
    After a while I might try and move away from boostrap, but that may never
    happen. If I do move away from bootstrap then all of these widgets will
    be changed

    Until after the initial deployment i am removing "dataset_user" and
    "dataset_password"
    """
    class Meta:
        model = Dataset

        fields = ["title", "author", "url",
                  "public_access", "description"]

        basic_input_class = "form-control"

        widgets = {
            "title": forms.TextInput(attrs={"class": basic_input_class}),
            "author": forms.TextInput(attrs={"class": basic_input_class}),
            "url": forms.TextInput(attrs={"class": basic_input_class}),
            "description": forms.Textarea(attrs={"class": basic_input_class})
        }


class DatasetUpdateAuthForm(forms.ModelForm):
    """
    This will only update the dataset_user and the dataset_password fields
    """
    class Meta:
        model = Dataset

        fields = ["dataset_user", "dataset_password",
                  "owncloud", "owncloud_instance", "owncloud_path"]

        basic_input_class = "form-control"

        widgets = {
            "dataset_user": forms.PasswordInput(attrs={"class": basic_input_class}),
            "dataset_password": forms.PasswordInput(attrs={"class": basic_input_class}),
            "owncloud_instance": forms.TextInput(attrs={"class": basic_input_class}),
            "owncloud_path": forms.TextInput(attrs={"class": basic_input_class})
        }
