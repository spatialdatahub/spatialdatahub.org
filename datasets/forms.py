from django.forms import ModelForm

from datasets.models import Dataset


class DatasetForm(ModelForm):

    class Meta:
        model = Dataset
        fields = ['author', 'title', 'description',
              'url', 'dataset_user', 'dataset_password',
              'public_access']
 
