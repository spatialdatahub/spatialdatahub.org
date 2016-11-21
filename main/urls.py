from django.conf.urls import url, include
from django.contrib import admin


urlpatterns = [
# admin
# datasets and accounts together

    url(r'^admin/', admin.site.urls),

    url(r'^',
        include('datasets.urls',
        namespace='datasets')),

]
