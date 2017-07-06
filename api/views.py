#from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework import viewsets

from accounts.models import Account

#from api.serializers import UserSerializer, AccountSerializer
from api.serializers import AccountSerializer

#from django.conf import settings

#User = get_user_model()

#class UserViewSet(viewsets.ModelViewSet):
#    queryset = User.objects.all().order_by('-date_joined')
#    serializer_class = UserSerializer


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all().order_by('-date_added')
    serializer_class = AccountSerializer
