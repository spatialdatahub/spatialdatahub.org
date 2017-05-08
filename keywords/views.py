from django.shortcuts import render
from django.shortcuts import get_object_or_404

from keywords.forms import KeywordCreateForm

from datasets.models import Dataset
from keywords.models import Keyword


# This should be removed
#def keyword_base(request):
#    template_name="keywords/keyword_base.html"
#    return render(request, template_name)

def keyword_list(request):
    """
    This is a view that will show all the keywords.
    This view should also show the number of datasets for each keyword. Maybe that is a
    template problem.
    """
    if "q" in request.GET:
        q = request.GET["q"]
        keyword_list = Keyword.objects.filter(keyword__icontains=q).order_by("keyword")
    else:
        keyword_list = Keyword.objects.all().order_by("keyword")

    template_name = "keywords/keyword_list.html"
    return render(request, template_name, {"keyword_list": keyword_list})


def keyword_datasets(request, keyword_slug=None):
    """    
    This checks if there is a GET request with a 'q' key, and then, if there is, it
    returns the list of q items as a list. Once there is the list, it can go filter
    the datasets by keyword primary key. I don't know if this would work with fields
    other than the primary key field. If there is not a request.GET item, it just
    returns all the datasets.
    """    
    keyword = get_object_or_404(Keyword, keyword_slug=keyword_slug)
    dataset_list = keyword.datasets.all()
    template_name = "keywords/keyword_datasets.html"
    return render(request, template_name,
                  context={"keyword": keyword, "dataset_list": dataset_list})


def new_keyword(request):
    """
    Gotta figure out a good way to make new keywords and associate them with
    the right datasets.
    """ 
    if request.method == "POST":
        form = KeywordCreateForm(request.POST) 
        if form.is_valid():
            form.save()
    form = KeywordCreateForm()
    template_name = "keywords/new_keyword.html"
    return render(request, template_name, {"form": form})
