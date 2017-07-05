from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework import viewsets

from api.serializers import UserSerializer

from django.conf import settings

User = get_user_model()

def hello(request):
    template_name="api/hello.html"
    return render(request, template_name)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
