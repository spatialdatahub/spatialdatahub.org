from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.models import Account
from datasets.models import Dataset
from keywords.models import Keyword

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'email', 'groups')


# perhaps this should be combined with the UserSerializer so that it doesn't
# look like there are two different models controlling this stuff. They
# are connected by a one-to-one field relationship
class AccountSerializer(serializers.ModelSerializer):

    user = UserSerializer()

    class Meta:
        model = Account
        fields = ('pk', 'user', 'affiliation', 'account_slug', 'date_added')


class KeywordSerializer(serializers.ModelSerializer):

    class Meta:
        model = Keyword
        fields = ('pk', 'keyword', 'keyword_slug')



class DatasetSerializer(serializers.ModelSerializer):

    account = AccountSerializer()
    keywords = KeywordSerializer(many=True)

    class Meta:
        model = Dataset
#        fields = ('pk', 'account', 'author', 'title', 'description', 'url', 
#                  'public_access', 'owncloud', 'dataset_slug', 'date_added',
#                  'ext', 'keywords')
        fields = ('pk', 'title', 'author', 'description', 'url', 'ext',
                  'public_access', 'owncloud', 'dataset_slug', 'date_added',
                  'keywords', 'account')




