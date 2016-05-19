from django.core.urlresolvers import reverse
from django.shortcuts import render

import requests
import json

def index(request):
    """
    Display template with progressively more items.
    """
    return render(request, 'portal/index.html')

def point_with_info_window(request):
    """
    Display template with single marker and info window.
    """
    return render(request, 'portal/point_with_info_window.html')

def many_points_hardcoded_js(request):
    """
    Display template with google maps javascript api and points hardcoded in the JavaScript script.
    """
    return render(request, 'portal/many_points_hardcoded_js.html')

def many_points_hardcoded_py(request):
    """
    Display template with google maps javascript api and points hardcoded in this views file.
    """
    bremen = {'cityname':'Bremen', 'lat': 53.0793, 'lng': 8.8017}
    indio = {'cityname':'Indio', 'lat': 33.7206, 'lng': -116.2156}
    honolulu = {'cityname':'Honolulu', 'lat': 21.3069, 'lng': -157.8583}
    cape_town = {'cityname': 'Cape Town', 'lat': -33.9249, 'lng': 18.4241}
    jakarta = {'cityname': 'Jakarta', 'lat': -6.1745, 'lng': 106.8227}

    locations = [bremen, indio, honolulu, cape_town, jakarta]
    context = {'locations': locations}

    return render(request, 'portal/many_points_hardcoded_py.html', context)

def many_points_with_info_windows(request):
    """
    Display template with google maps javascript api and points hardcoded in this views file.
    The hardcoded points in addition to cityname, latitude, and longitude  will have
    description and wikipedia key: value pairs,
    """

    bremen_description = '''<div id="content"><div id="siteNotice"></div>
        <h1 id="firstHeading" class="firstHeading">Bremen</h1>
        <div id="bodyContent">
        <p><b>Bremen</b>, is a hanseatic city in northern Germany</p>
        <p><a href="https://en.wikipedia.org/wiki/Bremen">Bremen on Wikipedia</a></p>
        </div></div>'''

    indio_description = '''<div id="content"><div id="siteNotice"></div>
        <h1 id="firstHeading" class="firstHeading">Indio</h1>
        <div id="bodyContent">
        <p><b>Indio</b>, is a desert city in southern California</p>
        <p><a href="https://en.wikipedia.org/wiki/Indio,_California">Indio on Wikipedia</a></p>
        </div></div>'''

    honolulu_description = '''<div id="content"><div id="siteNotice"></div>
        <h1 id="firstHeading" class="firstHeading">Honolulu</h1>
        <div id="bodyContent">
        <p><b>Honolulu</b>, is the most populous city in the Hawaiian Islands</p>
        <p><a href="https://en.wikipedia.org/wiki/Honolulu">Honolulu on Wikipedia</a></p>
        </div></div>'''

    cape_town_description = '''<div id="content"><div id="siteNotice"></div>
        <h1 id="firstHeading" class="firstHeading">Cape Town</h1>
        <div id="bodyContent">
        <p><b>Cape Town</b>, is a costal city in South Africa</p>
        <p><a href="https://en.wikipedia.org/wiki/Cape_Town">Cape Town on Wikipedia</a></p>
        </div></div>'''

    jakarta_description = '''<div id="content"><div id="siteNotice"></div>
        <h1 id="firstHeading" class="firstHeading">Jakarta</h1>
        <div id="bodyContent">
        <p><b>Jakarta</b>, is the capital of Indonesia</p>
        <p><a href="https://en.wikipedia.org/wiki/Jakarta">Cape Town on Wikipedia</a></p>
        </div></div>'''


    bremen = {'cityname':'Bremen', 'lat': 53.0793, 'lng': 8.8017,
              'description':bremen_description}
    indio = {'cityname':'Indio', 'lat': 33.7206, 'lng': -116.2156,
              'description':indio_description}
    honolulu = {'cityname':'Honolulu', 'lat': 21.3069, 'lng': -157.8583,
              'description':honolulu_description}
    cape_town = {'cityname': 'Cape Town', 'lat': -33.9249, 'lng': 18.4241,
              'description':cape_town_description}
    jakarta = {'cityname': 'Jakarta', 'lat': -6.1745, 'lng': 106.8227,
              'description':jakarta_description}

    locations = [bremen, indio, honolulu, cape_town, jakarta]
    context = {'locations': locations}

    return render(request, 'portal/many_points_with_info_windows.html', context)


def drag_and_drop_GeoJSON(request):
    return render(request, 'portal/drag_and_drop_GeoJSON.html')

def json_from_web_to_python(request):
    """
    This view will pull GeoJSON data from the url
    'http://api.tiles.mapbox.com/v3/mapbox.o11ipb8h/markers.geojson'
    and pass it to the django template where it will be parsed through with
    javascript and put onto the map.
    """

    r = requests.get('http://api.tiles.mapbox.com/v3/mapbox.o11ipb8h/markers.geojson').json()
    json_data = json.dumps(r)
    context = {'json_data': json_data}
    return render(request, 'portal/json_from_web_to_python.html', context)


def json_from_web_url(request):
    """
    This view loads a template with a simple javascript function that pulls
    GeoJSON data from the url
    'http://api.tiles.mapbox.com/v3/mapbox.o11ipb8h/markers.geojson'
    and loads it to the map.
    """
    return render(request, 'portal/json_from_web_url.html')

def map_with_clearable_points(request):
    """
    This view will load a template with GeoJSON data obtained using the python requests
    module, and it will have a button that allows the map to be cleared.
    """

    r = requests.get('http://api.tiles.mapbox.com/v3/mapbox.o11ipb8h/markers.geojson').json()
    json_data = json.dumps(r)
    context = {'json_data': json_data}
    return render(request, 'portal/map_with_clearable_points.html', context)


