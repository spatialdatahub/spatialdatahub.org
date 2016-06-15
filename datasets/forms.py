from django.forms import ModelForm

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, Field
from crispy_forms.bootstrap import (
    PrependedText, PrependedAppendedText, FormActions)

from datasets.models import Dataset


class DatasetForm(ModelForm):

    class Meta:
        model = Dataset
        fields = [ 'title', 'author', 'url',
              'dataset_user', 'dataset_password',
              'public_access', 'description']

