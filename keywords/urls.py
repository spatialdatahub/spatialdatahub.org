from django.conf.urls import url

from keywords import views

app_name = "keywords"

urlpatterns = [
    url(r'^$',
        views.keyword_list,
        name="keyword_list"),
]

