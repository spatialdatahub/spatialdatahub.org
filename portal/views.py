from django.shortcuts import render

def index(request):
    """
    Display template with only a google maps background.
    """
    return render(request, 'portal/index.html')
