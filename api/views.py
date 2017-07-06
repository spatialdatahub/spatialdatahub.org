from django.contrib.auth import get_user_model
from rest_framework import viewsets

from accounts.models import Account

from api.serializers import UserSerializer
from api.serializers import AccountSerializer


User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all().order_by('account_slug')
    serializer_class = AccountSerializer
