GIS Portal
========

This is the repository for the ZMT's GIS Portal (that will be online quite soon).
The master branch is quite a few commits behind the development and feature branches, and it does not
have the same functionality of the latest branches. Dispite this (or maybe because of this) it should 
be more or less bug free.


Site Description
----------------

The GIS Portal is a web application that allows anyone with locally stored 
GIS files (in the correct formats) to project their GIS files onto a map background.

The site does this by retrieving the dataset from the dataset's url (provided by the site user)
then then pushing the dataset to the Leaflet map background. The site can currently handle urls that do
and do not require password and username authentication.

On the main portal page datasets can be searched and filtered by title and viewed together or separately.
On the individual dataset pages user provided metadata can be viewed alongside the dataset. Eventually
datasets will be searchable by user, and other tags.

In the case that the user needs to update or delete a dataset record, there are pages that allow that to be
done. Any modifications to datasets must be done by users on their own databases. This site is only capable of
streaming datasets with GET based functions and cannot perform any POST based functions, which means that all
datasets are protected by the users who provide them.


Code
----

The majority of the code for this site is written in Python 3, JavaScript, HTML, and CSS.

The site uses the very popular Django web framework with a PostgreSQL database as the backend, the CSS framework
Bootstrap for aesthetics, and the JavaScript mapping library Leaflet to display datasets.

If you wish to run the functional tests this site has you will need the browser automation tool Selenium with python
bindings and a google chrome webdriver.

Leaflet js background


Installation and Dependencies
-----------------------------

python3
django
postgresql
requests
django-crispy-forms
selenium
qunit
leaflet
leaflet-omnivore
leaflet-providers
bootstrap-4
jquery
npm


Contribute
----------

If you would like to contribute to this project, submit a pull request. I would be delighted to have someone take a look at my code, and tear it apart.
I will say that if you contribute, that your contributions must pass unit and functional tests. There must also be documentation, or
explanation, so that I can understand what you did.


Support
-------

If you are having issues, please let the development team (Patrick Curry) know.
patrick.curry@leibniz-zmt.de
