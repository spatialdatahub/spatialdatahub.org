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
    k = Keyword.objects.all()

    if "q" in request.GET:
        q = request.GET["q"]
        keyword_list = k.filter(
            keyword__icontains=q).order_by("keyword")
    else:
        keyword_list = k.order_by("keyword")

    total_keywords = len(keyword_list)

    context = {"keyword_list": keyword_list, "total_keywords": total_keywords}
    template_name = "keywords/keyword_list.html"
    return render(request, template_name, context)

def keyword_detail(request, keyword_slug=None):
    """I making sure that dataset list is only defined once"""
    keyword = get_object_or_404(Keyword, keyword_slug=keyword_slug)
    d = keyword.datasets.all()

    if "q" in request.GET:
        q = request.GET["q"]
        dataset_list = d.filter(title__icontains=q).order_by("title")
    else:
        dataset_list = d

    template_name = "keywords/keyword_detail.html"
    return render(request, template_name,
                  context={"keyword": keyword, "dataset_list": dataset_list})
