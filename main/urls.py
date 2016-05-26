from django.conf.urls import url
from django.contrib import admin

from portal import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),

    url(r'^$',
        views.index,
        name='index'),

    url(r'^index2/$',
        views.index2,
        name='index2'),


    url(r'^point_with_info_window/$',
        views.point_with_info_window,
         name='point_with_info_window'),

    url(r'^map_with_clearable_points/$',
        views.map_with_clearable_points,
	name='map_with_clearable_points'),

    url(r'^map_with_clearable_points_from_multiple_sources/$',
        views.map_with_clearable_points_from_multiple_sources,
	name='map_with_clearable_points_from_multiple_sources'),
]

