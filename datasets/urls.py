from django.conf.urls import url

from datasets import views

app_name = "datasets"

urlpatterns = [

    # this could be a problem
    url(r'^load_dataset/(?P<pk>[0-9]+)/$',
        views.load_dataset,
        name="load_dataset"),

    url(r'^new_dataset/$',
        views.dataset_create_view,
        name="new_dataset"),

    url(r'^(?P<dataset_slug>[-\w]*)/(?P<pk>\d+)/$',
        views.dataset_detail,
        name="dataset_detail"),

    url(r'^(?P<dataset_slug>[-\w]*)/(?P<pk>[0-9]+)/update/$',
        views.DatasetUpdateView.as_view(),
        name="dataset_update"),

    url(r'^(?P<dataset_slug>[-\w]*)/(?P<pk>[0-9]+)/remove/$',
        views.dataset_remove,
        name="dataset_remove"),

]
