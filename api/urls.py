from django.conf.urls import url, include
from rest_framework import routers

from api import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'accounts', views.AccountViewSet)
router.register(r'datasets', views.DatasetViewSet)
router.register(r'keywords', views.KeywordViewSet)

app_name = "api"

urlpatterns = router.urls

"""
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='api'))
]
"""
