from django.contrib.auth import get_user_model
from rest_framework import viewsets

from accounts.models import Account
from datasets.models import Dataset
from keywords.models import Keyword

from api.serializers import AccountSerializer
from api.serializers import DatasetSerializer
from api.serializers import KeywordSerializer
from api.serializers import UserSerializer


User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all().order_by('account_slug')
    serializer_class = AccountSerializer


class DatasetViewSet(viewsets.ModelViewSet):
    queryset = Dataset.objects.all().order_by('dataset_slug')
    serializer_class = DatasetSerializer


class KeywordViewSet(viewsets.ModelViewSet):
    queryset = Keyword.objects.all().order_by('keyword_slug')
    serializer_class = KeywordSerializer
