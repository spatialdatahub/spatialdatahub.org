from django.conf.urls import url
from django.views.generic import TemplateView

from datasets import views

app_name = "datasets"

urlpatterns = [

    # I need to think of a new home page
    url(r'^$',
        views.PortalView.as_view(),
        name="portal"),

    url(r'^about/$',
        TemplateView.as_view(template_name="datasets/about.html"),
        name="about"),

    url(r'^contact/$',
        TemplateView.as_view(template_name="datasets/contact.html"),
        name="contact"),

    url(r'^new_dataset/$',
        views.DatasetCreateView.as_view(),
        name="new_dataset"),

    url(r'^load_dataset/(?P<pk>[0-9]+)/$',
        views.load_dataset,
        name="load_dataset"),

    # this view should be the portal view
    url(r'^(?P<account_slug>[-\w]*)/$',
        views.account_view,
        name="account_view"),

    url(r'^(?P<account_slug>[-\w]*)/(?P<dataset_slug>[-\w]*)/(?P<pk>\d+)/$',
        views.dataset_detail_view,
        name="dataset_detail"),

    url(r'^(?P<account_slug>[-\w]*)/(?P<dataset_slug>[-\w]*)/(?P<pk>[0-9]+)/update/$',
        views.DatasetUpdateView.as_view(),
        name="dataset_update"),

    url(r'^(?P<account_slug>[-\w]*)/(?P<dataset_slug>[-\w]*)/(?P<pk>[0-9]+)/remove/$',
        views.dataset_remove_view,
        name="dataset_remove"),

]
