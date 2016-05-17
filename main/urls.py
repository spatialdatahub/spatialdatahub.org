from django.conf.urls import url
from django.contrib import admin

from portal import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),

    url(r'^$', 
        views.index,
        name='index'),

    url(r'^many_points_hardcoded_js/$',
        views.many_points_hardcoded_js,
        name='many_points_hardcoded_js'),

    url(r'^many_points_hardcoded_py/$',
        views.many_points_hardcoded_py,
        name='many_points_hardcoded_py'),

    url(r'^point_with_info_window/$',
        views.point_with_info_window,
         name='point_with_info_window'),

    url(r'^many_points_with_info_windows/$',
        views.many_points_with_info_windows,
        name='many_points_with_info_windows'),


]
