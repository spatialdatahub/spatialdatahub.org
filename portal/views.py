from django.shortcuts import render

def index(request):
    """
    Display template with progressively more items.
    """
    return render(request, 'portal/index.html')

def tester(request):
    """
    Display template with google maps javascript api tests.
    """
    bremen = [53.0793, 8.8017]
    indio = [33.7206, -116.2156]
    honolulu = [21.3069, -157.8583]
    cape_town = [-33.9249, 18.4241]
    jakarta = [-6.1745, 106.8227]

    locations = [bremen, indio, honolulu, cape_town, jakarta]
    locations1 = ['bremen', 'indio', 'honolulu', 'cape_town', 'jakarta']
    context = {'locations': locations}

    return render(request, 'portal/tester.html', context)
