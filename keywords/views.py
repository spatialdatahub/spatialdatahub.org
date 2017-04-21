from django.shortcuts import render
from django.shortcuts import get_object_or_404

from datasets.models import Dataset
from keywords.models import Keyword


def keyword_base(request):
    template_name="keywords/keyword_base.html"
    return render(request, template_name)

def keyword_list(request):
    """
    This is a view that will show all the keywords.
    """
    if "q" in request.GET:
        q = request.GET["q"]
        keyword_list = Keyword.objects.filter(keyword__icontains=q).order_by("keyword")
    else:
        keyword_list = Keyword.objects.all().order_by("keyword")

    template_name = "keywords/keyword_list.html"
    return render(request, template_name, {"keyword_list": keyword_list})

def keyword_datasets(request):
    """    
    This checks if there is a GET request with a 'kw' key, and then, if there is, it
    returns the list of kw items as a list. Once there is the list, it can go filter
    the datasets by keyword primary key. I don't know if this would work with fields
    other than the primary key field. If there is not a request.GET item, it just
    returns all the datasets.
    """    
    
    if request.GET.get("kw"):
        kw = request.GET.getlist("kw")
        print(kw)
        dataset_list = Dataset.objects.filter(keyword__in=kw)
    
    else:
        dataset_list = Dataset.objects.all().order_by("title")

    template_name = "keywords/keyword_datasets.html"
    return render(request, template_name, {"dataset_list": dataset_list})
