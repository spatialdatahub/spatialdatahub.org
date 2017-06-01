GIS Portal
========

This is the repository for the ZMT's GIS Portal.

We are also writing a scientific paper that describes the tool. The paper's repository
is at https://github.com/patcurry/WebGISPaper.


ACCESSIBILITY!!!!


Important Questions
-------------------

Who is the audience?

  Who is the current audience?
    The scientists at the ZMT.

  Who is the initial target?
    Scientists everywhere.

  Who is the end target?
    Anybody who needs to visualize map data.

  How might this change?
    Perhaps it will start with scientists, then move to government
    and non government agencies, then out to corporations, then possible just the
    average user.

What platforms are they on?

  What platforms should I prioritize?
    Scientists will be on desktop and laptop computers most likely in their workplace.
    However, they may begin using the site in the field through their
    mobile devices, considering that it is a mapping app. So both desktop and mobile
    platforms should be given equal consideration with website development. With 
    data location and direction services being proritized on the mobile interface, and
    data visualization filtering and harvesting being prioritized for desktop devices.

  What operating systems will the be using?
    Hopefully chrome and firefox, probably safari, and some internet explorer users.
    Also whatever the mobile browsers are.

  How can I find out what hardware they have?
    Not certain yet.

  How can I prioritize my development?
    Build the site mobile ready right from the beginning. I don't want to have to
    go back and redo anything extraneously. Do it right the first time.

What kind of connectivity do they have?

  Cell, WiFi, fixed broadband?
    In the field I assume cell, or wifi if they are using the app at a field office,
    and broadband or wifi at work. Likely very good connectivity at their workplace
    and the full spectrum of mobile connectivity, from excellent to nothing at all, for
    work in the field.

  Offline?
    Perhaps people will want to do this, but I sort of doubt it.

What data cost can they handle?
  What resource cost is acceptable for the target audience?
    In the office, the data cost shouldn't matter too much, but in the field this 
    could be a problem, especially if they are trying to load large datasets.

  How much do they pay for data?
    I imagine they they will not pay anything for data in their workplace, but
    in their field, they could completely destroy their data requirements plan
    with this site.

  How can I measure this?

  Data budget?

  Data size and data cost?

Context
  Where will they be; indoors or outdoors?
    Primarily indoors, but if they are trying to locate somthing with the site,
    for instance a research location, they will be outdoors, or in a car.

  At home? In an office? In a car? On a train?
    Most likely in an office, primarily, and possibly in a car or on foot with
    the mobile.

  Will they be walking, sitting, or standing?
    All of the above.

  Will they be distracted or focused?
    Probably focused, unless they are searching for a site.

  What time of day? Will they be awake? Alert? Tired? Stressed?
    I imagine they will be awake and focused for the most part, because I don't
    see them using the app outside of work. 

What are the site requirements?
  Device performance?

  Site performance?

  Site content?

  Site functionality?

What are they using the site for?
  They are using the site to visualize data, to harvest, data
  for their own work, and to find locations for further research.


Site Description
----------------

The GIS Portal is a web application that allows anyone with remotely stored 
GIS files of various formats to project their GIS files onto a leaflet map background.

The site does this by making a request to the dataset's url (provided by the user)
then projecting the requested dataset to the leaflet map background. The site can currently handle
datasets with open urls, with password and username protected urls, and datasets that are stored
on owncloud.

On the main portal page datasets can be added to the map and toggled on and off, and the dataset list can be
filtered by dataset title. Soon datasets will be searchable by user, and other tags. On dataset specific pages
user provided metadata can be viewed alongside a mapshowing only that dataset. 

In the case that the user needs to update or delete a dataset record, there are pages that allow that to be
done. Any modifications to datasets must be done by users on their own databases. This site is only capable of
streaming datasets with GET based functions and cannot perform any POST based functions, which means that datasets
cannot be modified from this site.

Code
----

The majority of the code for this site is written in Python 3, JavaScript, HTML, and CSS.

The site uses the very popular Django web framework with a PostgreSQL database as the backend, the CSS framework
Bootstrap for aesthetics, and the JavaScript mapping library Leaflet to display datasets.

Contribute
----------

If you would like to contribute to this project, submit a pull request. We would be delighted to have someone take a look at our code, and tear it apart.
If you contribute, your contributions must pass unit and functional tests. There must also be documentation, or explanation, so that we can understand what you did.

Support
-------

If you are having issues, please let Patrick Curry, the site developer, know.
patrick.curry@leibniz-zmt.de


IDEAS
-----

npm with nominatim - yes
babeljs - Definitely
Vue instead of React... - Not important to use either of these yet

cyclejs

Ajax for search functions - possibly - possibly not

Maybe all the tests should just stay in their own apps as well. That way each app is a separate module.

What about consuming a rest api, and having a rest api??? Hmmm


Many of the pages are essentially the same (portal.js, keywordDetail.js, accountDetail.js, even datasetDetail.js).
They just need to have different dataset lists given to them, which means that they can probably be run by a single django view
that has a bunch of filter options. The view would be like this:

def portal(request):
    D = Dataset.objects.all()

    if "q" in request.GET:
        q = request.GET["q"]
        dataset_list = D.filter(
            Q(title__icontains=q) |
            Q(account__user__username__icontains=q) |
            Q(author__icontains=q) |
            Q(keyword__keyword__startswith=q)
            ).order_by("title").distinct()
    else:
        dataset_list = D.order_by("title")

    template_name = "portal.html"
    return render(request, template_name, {"dataset_list": dataset_list})

Unfortunately this doesn't let the client filter datasets with multiple terms sequentially for instance all of a particular account's datasets that contain a particular word.

What if I did this:

# this would work, but it's pretty ugly, and if there are search terms the Dataset.objects.all() list goes:
# Dataset.objects.all() -> t_list -> a_list -> k_list -> dataset_list
def portal(request):
    D = Dataset.objects.all()

    if "q" in request.GET:
        q = request.GET["q"]
        t_list = D.filter(title__icontains=q)
    else:
        t_list = D.order_by("title")

    if "a" in request.GET:
        a = request.GET["a"]
        a_list = t_list.filter(account__user__username__icontains=a)
    else:
        a_list = t_list

    if "k" in request.GET:
        k = request.GET["k"]
        k_list = a_list.filter(keyword__keyword__icontains=q)
    else:
        k_list = a_list

    dataset_list = k_list.order_by("title")
 
    template_name = "portal.html"
    return render(request, template_name, {"dataset_list": dataset_list})

