from django.shortcuts import render

from keywords.models import Keyword

# should this be in the dataset app, or should it be in it's own app?
def keyword_list(request):
    """
    This is a view that will show all the keywords.
    """
    keyword_list = Keyword.objects.all()
    template_name = "datasets/keyword_list.html"

    # how do I put this into an ajax call?
    # check the django ajax project
#    if "q" in request.GET:
#        q = request.GET["q"]
#        dataset_list = Keyword.objects.filter().order_by("keyword")

    return render(request, template_name, {"keyword_list": keyword_list})
'''
def keyword_detail(request, keyword_slug):
    """
    This view will show all the datasets and accounts associated with
    each keyword
    """
    keyword = get_object_or_404(Keyword, keyword_slug=keyword_slug) 
    template_name = "datasets/keyword_detail.html"
    return render(request, template_name, {"keyword": keyword})
'''
