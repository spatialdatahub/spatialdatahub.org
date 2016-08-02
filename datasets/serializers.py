from django.core.serializers import serialize

from datasets.models import Dataset

import json
import requests

def dataset_model_serializer(dataset_list):
    """
    Develop a method that (1) checks whether there is a single
    dataset or a dataset list, (2) changes the data to json,
    and (3) what extension the dataset has, (4) checks whether
    there is a dataset username and password.

    If the extension is kml or kmz and the dataset is username
    and password protected there will need to be a special way
    to pass the data to the view.

    The method will then decide whether to pass the actual data
    to the view, or just the url.
    """

    # 1 This is a bit hacky for sure, but it should work
    # So, I am using a filter instead of a get request, this is not the best
    # way to do things maybe, but it returns a queryset
#    if not len(dataset_list):
#        dataset_list = [dataset_list, ]

    # 2
    serialized_dataset_list = serialize('json', dataset_list)
    serialized_dataset_list = json.loads(serialized_dataset_list)

    # 3
    for dataset in serialized_dataset_list:
        if dataset['fields']['url'].lower().endswith('.json'):
            dataset['fields']['extension'] = 'json'
        if dataset['fields']['url'].lower().endswith('.kml'):
            dataset['fields']['extension'] = 'kml'
        if dataset['fields']['url'].lower().endswith('.kmz'):
            dataset['fields']['extension'] = 'kmz'

    # 4
    for dataset in serialized_dataset_list:
        if dataset['fields']['dataset_user'] != "" and dataset['fields']['dataset_password'] != "" :
            requests.packages.urllib3.disable_warnings()
            r = requests.get(dataset['fields']['url'],
                             auth=(dataset['fields']['dataset_user'],
                             dataset['fields']['dataset_password']),
                             verify=False) # THIS IS FOR TESTING AND WILL BE
                                 #REMOVED IMMEDIATELY AFTER THE TEST

            dataset['fields']['json'] = r.json()
            dataset['fields']['status_code'] = r.status_code
        dataset['fields']['dataset_user'] = ""
        dataset['fields']['dataset_password'] = ""

    return serialized_dataset_list

