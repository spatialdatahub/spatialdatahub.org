from django.conf.urls import url

from keywords import views

app_name = "keywords"

urlpatterns = [
    url(r'^$',
        views.keyword_list,
        name="keyword_list"),

    url(r'^new_keyword/$',
        views.new_keyword,
        name="new_keyword"),

    url(r'^(?P<keyword_slug>[-\w]*)/$', # this is analagous to the account_detail view
        views.keyword_datasets,
        name="keyword_datasets"),

#    url(r'^(?P<account_slug>[-\w]*)/remove/$',
#        views.account_remove,
#        name="account_remove"),
#
#    url(r'^(?P<account_slug>[-\w]*)/update/$',
#        views.account_update,
#        name="account_update"),

]
