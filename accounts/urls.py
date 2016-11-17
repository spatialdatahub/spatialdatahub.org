from django.conf.urls import url

from accounts import views

app_name = "accounts"

urlpatterns = [

    url(r'^register/$',
        views.register,
        name="register"),

    url(r'^login/$',
        views.login_view,
        name="login"),

    url(r'^logout/$',
        views.logout_view,
        name="logout"),

    url(r'^test_login/$',
        views.test_login,
        name="test_login"),
]
