GIS Portal
========

This is the repository for the ZMT's GIS Portal.

We are also writing a scientific paper that describes the tool. The paper's repository
is at https://github.com/patcurry/WebGISPaper.

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

If you wish to run the functional tests this site has you will need the browser automation tool Selenium with python
bindings and a google chrome webdriver.


Contribute
----------

If you would like to contribute to this project, submit a pull request. We would be delighted to have someone take a look at our code, and tear it apart.
If you contribute, your contributions must pass unit and functional tests. There must also be documentation, or explanation, so that we can understand what you did.

Support
-------

If you are having issues, please let Patrick Curry, the site developer, know.
patrick.curry@leibniz-zmt.de


IDEAS
_____

npm with nominatim
babeljs
Vue instead of React...
