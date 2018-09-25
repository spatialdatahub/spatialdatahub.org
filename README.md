# spatialdatahub.org

#### Target location: https://spatialdatahub.org/

## Project Description
The number of online data repositories is growing and they are becoming increasingly difficult to navigate. Many repositories are plagued by convoluted architecture, link rot and site death. To access data users must rely on site specific tools or download datasets to their computers. These hurdles hinder data findability and accessibility and cost precious time. We developed the open source web application Spatial Data Hub to address these issues through simultaneous display and comparison of geospatial datasets from disparate internet sources on a single map. It aims to promote all data equally and provide the flexibility to connect to any storage system, effectively making difficult to find datasets as visible as those in large, established repositories. Its low barrier of entry allows scientists to add data throughout the research process, enhancing transparency, openness and reproducibility. This flexibility and functionality make Spatial Data Hub a new exciting platform for researchers to promote their work, develop new hypotheses and create new collaborations.


Spatial Data Hub is a web application that allows anyone with remotely stored GIS files of various formats to project their GIS files onto a leaflet map background. The site does this by making a request to the dataset's url (provided by the user) then projecting the requested dataset to the leaflet map background. The site can currently handle datasets with open urls, with password and username protected urls, and datasets that are stored on owncloud. On the main portal page datasets can be added to the map and toggled on and off, and the dataset list can be filtered by dataset title. Soon datasets will be searchable by user, and other tags. On dataset specific pages user provided metadata can be viewed alongside a mapshowing only that dataset. In the case that the user needs to update or delete a dataset record, there are pages that allow that to be done. Any modifications to datasets must be done by users on their own databases. This site is only capable of streaming datasets with GET based functions and cannot perform any POST based functions, which means that datasets cannot be modified from this site.

## Project Goals


## Recent Developments
Upgraded to Django 2.0, have to deal with breaking changes
Upgraded to Python 3.6 from Python 3.5, some string formatting stuff here and there, but not much else that would break functionality


## Current Issues
- Currently the javascript in the app is getting difficult to control. State management specifically. It could be a good idea to add a library like React and Redux to the project, but that could be a huge amount of coding and energy spent.


## Tests

### Django

#### Written and Passing
- Tests for accounts app
- Tests for datasets app
- Tests for keywords app
- Tests for views in "main" part app

#### Written and Failing
- Any functional / end-to-end tests with selenium

#### Unwritten
- Tests for the api app
- Tests for the institution app

### JavaScript

#### Written and Passing
- tests for specific files

#### Written and Failing
- It seems that the written tests pass

#### Unwritten
- Lots of tests... this I'll have to go through and populate this section.

## Future Directions

### Python / Django
- Institution / Group app
- Restricting dataset access to those with permission

### Javascript

## Important Questions
Who is the audience?

  Who is the current audience?
    The scientists at the ZMT.

  Who is the initial target?
    Scientists everywhere.

  Who is the end target?
    Anybody who needs to visualize map data.

  How might this change?
    Perhaps it will start with scientists, then move to government and non government agencies, then out to corporations, then possible just the average user.

What platforms are they on?

  What platforms should I prioritize?
    Scientists will be on desktop and laptop computers most likely in their workplace. However, they may begin using the site in the field through their mobile devices, considering that it is a mapping app. So both desktop and mobile platforms should be given equal consideration with website development. With data location and direction services being proritized on the mobile interface, and data visualization filtering and harvesting being prioritized for desktop devices.

  What operating systems will the be using?
    Hopefully chrome and firefox, probably safari, and some internet explorer users. Also whatever the mobile browsers are.

  How can I find out what hardware they have?
    Not certain yet.

  How can I prioritize my development?
    Build the site mobile ready right from the beginning. I don't want to have to go back and redo anything extraneously. Do it right the first time.

What kind of connectivity do they have?

  Cell, WiFi, fixed broadband?
    In the field I assume cell, or wifi if they are using the app at a field office, and broadband or wifi at work. Likely very good connectivity at their workplace and the full spectrum of mobile connectivity, from excellent to nothing at all, for work in the field.

  Offline?
    No.

What data cost can they handle?

  What resource cost is acceptable for the target audience?
    In the office, the data cost shouldn't matter too much, but in the field this could be a problem, especially if they are trying to load large datasets.

  How much do they pay for data?
    I imagine they they will not pay anything for data in their workplace, but in their field, they could completely destroy their data requirements plan with this site.

  How can I measure this?

  Data budget?

  Data size and data cost?
    
Context

  Where will they be; indoors or outdoors?
    Primarily indoors, but if they are trying to locate somthing with the site, for instance a research location, they will be outdoors, or in a car.

  At home? In an office? In a car? On a train?
    Most likely in an office, primarily, and possibly in a car or on foot with the mobile.

  Will they be walking, sitting, or standing?
    All of the above.

  Will they be distracted or focused?
    Probably focused, unless they are searching for a site.

  What time of day? Will they be awake? Alert? Tired? Stressed?
    I imagine they will be awake and focused for the most part, because I don't see them using the app outside of work.

What are the site requirements?
  Device performance?

  Site performance?

  Site content?

  Site functionality?

What are they using the site for?
  They are using the site to visualize data, to harvest, data for their own work, and to find locations for further research.

## Code
The majority of the code for this site is written in Python 3, JavaScript, HTML, and CSS.

The site uses the very popular Django web framework with a PostgreSQL database as the backend, the CSS framework Bootstrap for aesthetics, and the JavaScript mapping library Leaflet to display datasets.

## Contribute
If you would like to contribute to this project, submit a pull request. We would be delighted to have someone take a look at our code, and tear it apart.
If you contribute, your contributions must pass unit and functional tests. There must also be documentation, or explanation, so that we can understand what you did.

## Support
If you are having issues please contact Patrick Curry at patrick.curry@leibniz-zmt.de.