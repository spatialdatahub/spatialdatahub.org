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
    return render(request, 'portal/tester.html')
