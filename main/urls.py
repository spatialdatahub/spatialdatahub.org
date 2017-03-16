from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth.forms import UserCreationForm
from django.views.generic import TemplateView
from django.views.generic.edit import CreateView

from main import views


urlpatterns = [

    # should this be part of the accounts app, where I create an account?
    url(r'^register/',
        CreateView.as_view(
            template_name='register.html',
            form_class=UserCreationForm,
            success_url='/login'
        ),
        name='register'),

    # django sign in forms and stuff
    url(r'^', include('django.contrib.auth.urls')),
    #
    # The default urls from django.contrib.auth.urls:
    # ^login/$ [name='login']
    # ^logout/$ [name='logout']
    # ^password_change/$ [name='password_change']
    # ^password_change/done/$ [name='password_change_done']
    # ^password_reset/$ [name='password_reset']
    # ^password_reset/done/$ [name='password_reset_done']
    # ^reset/(?P<uidb64>[0-9A-Za-z_\-]+)/
    #     (?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$
    #     [name='password_reset_confirm']
    # ^reset/done/$ [name='password_reset_complete']
    #
    # I also want to put create update delete user views in this part
    #

    url(r'^admin/', admin.site.urls),

    url(r'^access_denied/$',
        TemplateView.as_view(template_name="access_denied.html"),
        name="access_denied"),

    url(r'^about/$',
        TemplateView.as_view(template_name="about.html"),
        name="about"),

    url(r'^contact/$',
        TemplateView.as_view(template_name="contact.html"),
        name="contact"),

    url(r'^one_time_view/$',
        views.one_time_view,
        name="one_time_view"),

    url(r'^jstests/$',
        views.jstests,
        name="jstests"),

    url(r'^$',
        views.portal,
        name="portal"),

    url(r'^load_dataset/(?P<pk>[0-9]+)/$',
        views.load_dataset,
        name="load_dataset"),

    url(r'^',
        include('accounts.urls',
                namespace='accounts')),

    url(r'^(?P<account_slug>[-\w]*)/',
        include('datasets.urls',
                namespace='datasets')),

]
