from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import TemplateView

from main import views


urlpatterns = [

    url(r'^admin/', admin.site.urls),

    # django sign in forms and stuff
    url(r'^registration/', include('django.contrib.auth.urls')),

    url(r'^about/$',
        TemplateView.as_view(template_name="about.html"),
        name="about"),

    url(r'^contact/$',
        TemplateView.as_view(template_name="contact.html"),
        name="contact"),

    url(r'^jstests/$',
        views.jstests,
        name="jstests"),

    url(r'^$',
        views.portal,
        name="portal"),

    url(r'^load_dataset/(?P<pk>[0-9]+)/$',
        views.load_dataset,
        name="load_dataset"),

    url(r'^',
        include('accounts.urls',
                namespace='accounts')),

    url(r'^(?P<account_slug>[-\w]*)/',
        include('datasets.urls',
                namespace='datasets')),

]
