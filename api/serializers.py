from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.models import Account

User = get_user_model()


class UserSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'email', 'groups')


class AccountSerializer(serializers.HyperlinkedModelSerializer):

    user = UserSerializer()

    class Meta:
        model = Account
        fields = ('user', 'affiliation', 'account_slug', 'date_added')
