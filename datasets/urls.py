from django.conf.urls import url

from datasets import views
from accounts import views as account_views

app_name = "datasets"

urlpatterns = [

    url(r'^$',
        views.PortalView.as_view(),
        name="portal"),

    url(r'^about/$',
        views.AboutView.as_view(),
        name="about"),

    url(r'^contact/$',
        views.ContactView.as_view(),
        name="contact"),

    url(r'^new_dataset/$',
        views.DatasetCreateView.as_view(),
        name="new_dataset"),

    url(r'^load_dataset/(?P<pk>[0-9]+)/$',
        views.load_dataset,
        name="load_dataset"),

    url(r'^(?P<account_slug>[-\w]*)/$',
        account_views.account_view,
        name="account_view"),

    url(r'^(?P<dataset_slug>[-\w]*)/(?P<pk>[0-9]+)/update/$',
        views.DatasetUpdateView.as_view(),
        name="dataset_update"),

    url(r'^(?P<dataset_slug>[-\w]*)/(?P<pk>[0-9]+)/remove/$',
        views.DatasetRemoveView.as_view(),
        name="dataset_remove"),

    url(r'^(?P<account_slug>[-\w]*)/(?P<dataset_slug>[-\w]*)/(?P<pk>\d+)/$',
        views.dataset_detail_view,
        name="dataset_detail"),

]
