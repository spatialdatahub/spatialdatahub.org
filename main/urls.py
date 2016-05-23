from django.conf.urls import url
from django.contrib import admin

from portal import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),

    url(r'^$',
        views.index,
        name='index'),

    url(r'^point_with_info_window/$',
        views.point_with_info_window,
         name='point_with_info_window'),

    url(r'^many_points_with_info_windows/$',
        views.many_points_with_info_windows,
        name='many_points_with_info_windows'),

    url(r'^drag_and_drop_geojson/$',
        views.drag_and_drop_GeoJSON,
        name='drag_and_drop_geojson'),

    url(r'^map_with_clearable_points/$',
        views.map_with_clearable_points,
	name='map_with_clearable_points'),

    url(r'^map_with_clearable_points_from_multiple_sources/$',
        views.map_with_clearable_points_from_multiple_sources,
	name='map_with_clearable_points_from_multiple_sources'),

    url(r'^json_requests_python/$',
        views.json_requests_python,
        name='json_requests_python'),

    url(r'^json_requests_js/$',
        views.json_requests_js,
        name='json_requests_js'),

]

