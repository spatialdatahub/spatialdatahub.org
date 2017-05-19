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

    url(r'^(?P<keyword_slug>[-\w]*)/$',
        views.keyword_datasets,
        name="keyword_datasets"),
]
