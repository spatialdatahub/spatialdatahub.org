from django.conf.urls import url

from datasets import views

app_name = 'datasets'

urlpatterns = [

    url(r'^$',
        views.portal,
        name='portal'),

   url(r'^new_dataset/$',
        views.DatasetCreate.as_view(),
        name='dataset_create'),

    url(r'^(?P<slug>[-\w]*)-(?P<pk>[0-9]+)/update/$',
        views.DatasetUpdate.as_view(),
        name='dataset_update'),

    url(r'^(?P<slug>[-\w]*)-(?P<pk>[0-9]+)/delete/$',
        views.DatasetDelete.as_view(),
        name='dataset_delete'),

    url(r'^(?P<slug>[-\w]*)-(?P<pk>\d+)/$',
        views.dataset_detail,
        name='dataset_detail'),
]
