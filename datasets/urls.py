from django.conf.urls import url

from datasets import views

app_name = "datasets"

urlpatterns = [


    url(r'^new_dataset/$',
        views.new_dataset,
        name="new_dataset"),

    url(r'^(?P<dataset_slug>[-\w]*)/(?P<pk>\d+)/$',
        views.dataset_detail,
        name="dataset_detail"),

    url(r'^(?P<dataset_slug>[-\w]*)/(?P<pk>[0-9]+)/update/$',
        views.dataset_update,
        name="dataset_update"),

    url(r'^(?P<dataset_slug>[-\w]*)/(?P<pk>[0-9]+)/update/auth/$',
        views.dataset_update_auth,
        name="dataset_update_auth"),

    url(r'^(?P<dataset_slug>[-\w]*)/(?P<pk>[0-9]+)/remove/$',
        views.dataset_remove,
        name="dataset_remove"),

]
