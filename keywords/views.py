from django.shortcuts import render
from django.shortcuts import get_object_or_404

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
        keyword_list = Keyword.objects.all()
    template_name = "keywords/keyword_list.html"
    return render(request, template_name, {"keyword_list": keyword_list})


def keyword_datasets(request, keyword_slug):
    """
    This view will show all the datasets and accounts associated with
    each keyword
    """
    keyword = get_object_or_404(Keyword, keyword_slug=keyword_slug) 
    template_name = "keywords/keyword_datasets.html"
    return render(request, template_name, {"keyword": keyword})

