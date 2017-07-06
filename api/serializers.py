#from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework import serializers

from accounts.models import Account

#User = get_user_model()


#class UserSerializer(serializers.HyperlinkedModelSerializer):

#    class Meta:
#        model = User
#        fields = ('url', 'username', 'email', 'groups')


class AccountSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Account
        fields = ('user', 'affiliation', 'account_slug', 'date_added')
        extra_kwargs = {'url': {'view_name': 'api:account-detail'}}
