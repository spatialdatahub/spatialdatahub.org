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

    url(r'^drag_and_drop_geojson/$',
        views.drag_and_drop_GeoJSON,
        name='drag_and_drop_geojson'),

    url(r'^json_from_web_url/$',
        views.json_from_web_url,
        name='json_from_web_url'),

    url(r'^json_from_web_to_python/$',
        views.json_from_web_to_python,
        name='json_from_web_to_python'),

    url(r'^map_with_clearable_points/$',
        views.map_with_clearable_points,
	name='map_with_clearable_points'),

    url(r'^map_with_clearable_points_from_multiple_sources/$',
        views.map_with_clearable_points_from_multiple_sources,
	name='map_with_clearable_points_from_multiple_sources'),
]
