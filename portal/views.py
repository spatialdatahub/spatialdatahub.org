from django.core.urlresolvers import reverse
from django.shortcuts import render

from datasets.models import Dataset

import requests
import json

def index(request):
    """
    Display template with progressively more items.
    """
    dataset_list = Dataset.objects.all()


    context = {'dataset_list': dataset_list}
    return render(request, 'portal/index.html', context)

def point_with_info_window(request):
    """
    Display template with single marker and info window.
    """
    return render(request, 'portal/point_with_info_window.html')

def drag_and_drop_GeoJSON(request):
    return render(request, 'portal/drag_and_drop_GeoJSON.html')

def map_with_clearable_points(request):
    """
    This view will load a template with GeoJSON data obtained using the python requests
    module, and it will have a button that allows the map to be cleared.
    """

    r = requests.get('http://api.tiles.mapbox.com/v3/mapbox.o11ipb8h/markers.geojson').json()
    json_data = json.dumps(r)
    context = {'json_data': json_data}
    return render(request, 'portal/map_with_clearable_points.html', context)

def map_with_clearable_points_from_multiple_sources(request):
    """
    This view will load a template with two GeoJSON datasets obtained using the python requests
    module, and it will have a button that allows the map to be cleared.
    """

    r1 = requests.get('http://api.tiles.mapbox.com/v3/mapbox.o11ipb8h/markers.geojson').json()
    r2 = requests.get('https://storage.googleapis.com/maps-devrel/google.json').json()
    json_data1 = json.dumps(r1)
    json_data2 = json.dumps(r2)

    context = {'json_data1': json_data1, 'json_data2': json_data2}
    return render(request, 'portal/map_with_clearable_points_from_multiple_sources.html', context)


def bremen_weather_forecast(request):
    """
    Using the python requests module and an api key I will get the weather from the website
    forcast.io and project.
    """

    api_url="https://api.forcast.io/forcast/%s/%f.%f"
    api_key="9f7a857c522f06231fed58450a02cbd9"
    lat=53.0793
    lng=8.8017

    query_url = api_url % (api_key, lat, lng)
    r = requests.get(query_url)
    if r.status_code != 200:
        print("Error:", r.status_code)

    json_weather = r.json()
    context = {'json_weather': json_weather}
    return render(request, 'portal/bremen_weather_forcast.html', context)


