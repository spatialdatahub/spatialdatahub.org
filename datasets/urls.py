from django.conf.urls import url

from datasets import views
from accounts import views as account_views

app_name = "datasets"

urlpatterns = [

    # I need to think of a new home page
    url(r'^$',
        views.PortalView.as_view(),
        name="portal"),

    url(r'^new_account/$',
        account_views.new_account,
        name="new_account"),

    url(r'^accounts/$',
        account_views.account_list,
        name="account_list"),

    url(r'^load_dataset/(?P<pk>[0-9]+)/$',
        views.load_dataset,
        name="load_dataset"),

    url(r'^(?P<account_slug>[-\w]*)/new_dataset/$',
        views.dataset_create_view,
        name="new_dataset"),

    # this view should be the portal view
    url(r'^(?P<account_slug>[-\w]*)/$',
        account_views.account_detail,
        name="account_detail"),

    url(r'^(?P<account_slug>[-\w]*)/remove/$',
        account_views.account_remove,
        name="account_remove"),

    url(r'^(?P<account_slug>[-\w]*)/(?P<dataset_slug>[-\w]*)/(?P<pk>\d+)/$',
        views.dataset_detail_view,
        name="dataset_detail"),

    url(r'^(?P<account_slug>[-\w]*)/(?P<dataset_slug>[-\w]*)/(?P<pk>[0-9]+)/update/$',
        views.DatasetUpdateView.as_view(),
        name="dataset_update"),

    url(r'^(?P<account_slug>[-\w]*)/(?P<dataset_slug>[-\w]*)/(?P<pk>[0-9]+)/remove/$',
        views.dataset_remove,
        name="dataset_remove"),

]
