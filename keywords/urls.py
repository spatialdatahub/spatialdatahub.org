from django.conf.urls import url

from keywords import views

app_name = "keywords"

urlpatterns = [

    url(r'^$',
        views.keyword_base,
        name="keyword_base"),

    url(r'^list/$',
        views.keyword_list,
        name="keyword_list"),

    url(r'^(?P<keyword_slug>[-\w]*)/$',
        views.keyword_datasets,
        name="keyword_datasets"),
]

