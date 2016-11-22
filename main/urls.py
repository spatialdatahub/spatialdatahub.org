from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import TemplateView

from main.views import PortalView


urlpatterns = [

    url(r'^admin/', admin.site.urls),

    url(r'^about/$',
        TemplateView.as_view(template_name="about.html"),
        name="about"),

    url(r'^contact/$',
        TemplateView.as_view(template_name="contact.html"),
        name="contact"),

    url(r'^$',
        PortalView.as_view(),
        name="portal"),

    url(r'^',
        include('accounts.urls',
        namespace='accounts')),

    url(r'^(?P<account_slug>[-\w]*)/',
        include('datasets.urls',
        namespace='datasets')),

]
