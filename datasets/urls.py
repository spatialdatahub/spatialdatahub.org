from django.conf.urls import url

from datasets import views

app_name = 'datasets'

urlpatterns = [
    url(r'^$',
        views.portal,
        name='portal'),

    url(r'^requeststojstest$',
        views.requeststojstest,
        name='requeststojstest'),

    url(r'^about/$',
        views.about,
        name='about'),

    url(r'^contact/$',
        views.contact,
        name='contact'),

    url(r'^new_dataset/$',
        views.DatasetCreateView.as_view(),
        name='dataset_create'),

    url(r'^(?P<slug>[-\w]*)-(?P<pk>[0-9]+)/update/$',
        views.DatasetUpdateView.as_view(),
        name='dataset_update'),

    url(r'^(?P<slug>[-\w]*)-(?P<pk>[0-9]+)/remove/$',
        views.DatasetRemoveView.as_view(),
        name='dataset_remove'),

    url(r'^(?P<slug>[-\w]*)-(?P<pk>\d+)/$',
        views.DatasetDetailView.as_view(),
        name='dataset_detail'),

]
