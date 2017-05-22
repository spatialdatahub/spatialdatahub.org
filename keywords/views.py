from django.shortcuts import render
from django.shortcuts import get_object_or_404

from keywords.forms import KeywordCreateForm
from keywords.models import Keyword


def keyword_list(request):
    """
    This is a view that will show all the keywords.
    This view should also show the number of datasets for each keyword.
    Maybe that is a template problem.
    """
    if "q" in request.GET:
        q = request.GET["q"]
        keyword_list = Keyword.objects.filter(
            keyword__icontains=q).order_by("keyword")
    else:
        keyword_list = Keyword.objects.all().order_by("keyword")

    total_keywords = len(keyword_list)

    template_name = "keywords/keyword_list.html"
    return render(request, template_name,
                  {"keyword_list": keyword_list,
                   "total_keywords": total_keywords})

def keyword_datasets(request, keyword_slug=None):
    keyword = get_object_or_404(Keyword, keyword_slug=keyword_slug)
    dataset_list = keyword.datasets.all()
    template_name = "keywords/keyword_datasets.html"
    return render(request, template_name,
                  context={"keyword": keyword, "dataset_list": dataset_list})

