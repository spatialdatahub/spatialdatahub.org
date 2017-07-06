from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.models import Account
from datasets.models import Dataset

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'email', 'groups')


class AccountSerializer(serializers.ModelSerializer):

    user = UserSerializer()

    class Meta:
        model = Account
        fields = ('user', 'affiliation', 'account_slug', 'date_added')


class DatasetSerializer(serializers.ModelSerializer):

    account = AccountSerializer()

    class Meta:
        model = Dataset
        fields = ('account', 'author', 'title', 'description', 'url', 
                  'public_access', 'owncloud', 'dataset_slug', 'date_added',
                  'ext')
