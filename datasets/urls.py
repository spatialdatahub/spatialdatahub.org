from django.conf.urls import url

from datasets import views

app_name = 'datasets'

urlpatterns = [
    url(r'^$',
        views.portal,
        name='portal'),

    url(r'^google_map$',
        views.portal_google,
        name='portal_google'),

    url(r'^new_dataset/$',
        views.dataset_create,
        name='dataset_create'),

    url(r'^(?P<slug>[-\w]*)-(?P<pk>[0-9]+)/update/$',
        views.dataset_update,
        name='dataset_update'),

    url(r'^(?P<slug>[-\w]*)-(?P<pk>[0-9]+)/delete/$',
        views.DatasetDelete.as_view(),
        name='dataset_delete'),

    url(r'^(?P<slug>[-\w]*)-(?P<pk>\d+)/$',
        views.dataset_detail,
        name='dataset_detail'),
]
