from django.conf.urls import url

from accounts import views

app_name = "accounts"

urlpatterns = [

    # this will be the account_slug
    url(r'^account_view/$',
        views.AccountView.as_view(),
        name="account_view"),

    url(r'^james/$',
        views.James.as_view(),
        name="james"),

]
