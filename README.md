# spatialdatahub.org

#### Target location: https://spatialdatahub.org/

## Publication
- We have written a manuscript that describes the Spatial Data Hub concept, justification and development. It is currently in review.
- We are looking into registering Spatial Data Hub on Zenodo so that we have a citable DOI for the source code.

## Project Description
The number of online data repositories is growing and they are becoming increasingly difficult to navigate. Many repositories are plagued by convoluted architecture, link rot and site death. To access data users must rely on site specific tools or download datasets to their computers. These hurdles hinder data findability and accessibility and cost precious time. We developed the open source web application Spatial Data Hub to address these issues through simultaneous display and comparison of geospatial datasets from disparate internet sources on a single map. It aims to promote all data equally and provide the flexibility to connect to any storage system, effectively making difficult to find datasets as visible as those in large, established repositories. Its low barrier of entry allows scientists to add data throughout the research process, enhancing transparency, openness and reproducibility. This flexibility and functionality make Spatial Data Hub a new exciting platform for researchers to promote their work, develop new hypotheses and create new collaborations.

Spatial Data Hub is a web application that allows anyone with remotely stored GIS files of various formats to project their GIS files onto a leaflet map background. The site does this by making a request to the dataset's url (provided by the user) then projecting the requested dataset to the leaflet map background. The site can currently handle datasets with open urls, with password and username protected urls, and datasets that are stored on owncloud. On the main portal page datasets can be added to the map and toggled on and off, and the dataset list can be filtered by dataset title. Soon datasets will be searchable by user, and other tags. On dataset specific pages user provided metadata can be viewed alongside a mapshowing only that dataset. In the case that the user needs to update or delete a dataset record, there are pages that allow that to be done. Any modifications to datasets must be done by users on their own databases. This site is only capable of streaming datasets with GET based functions and cannot perform any POST based functions, which means that datasets cannot be modified from this site.

## Code
The majority of the code for this site is written in Python 3, JavaScript, HTML, and CSS. The site uses the very popular Django web framework with a PostgreSQL database as the backend, the CSS framework Bootstrap for aesthetics, and the JavaScript mapping library Leaflet to display datasets.

## Contribute
- If you would like to contribute to this project, submit a pull request. We would be delighted to have someone look at our code, and tear it apart.
- Contributions must pass tests. In the case that the contribution is novel, please write tests specific to the contribution. Also, there must also be documentation or explanation of novel contributions, so that we can understand how to work with the contribution.

## Support
If you are having issues please contact Patrick Curry at patrick.curry@leibniz-zmt.de.

## Recent Developments
- Upgraded to Django 2.1, to handle vulnerabilities
- Upgraded to Python 3.6 from Python 3.5, some string formatting stuff here and there, but not much else that would break functionality

## Current Issues
- Currently the javascript in the app is getting difficult to control. State management specifically. It could be a good idea to add a library like React and Redux to the project, but that could be a huge amount of coding and energy spent.
- Fix scrollbar for dataset list on the portal pages
- Remove Bootstrap and use CSS-Grid and Flexbox

## Planned Changes
- Move project from Amazon Elastic Beanstalk to servers hosted by ZMT
- Move continuous integration from Travis-CI to Gitlab
- Host mirror repositories on GitHub and ZMT Gitlab Instance

## Potential Changes Not Decided Yet
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
- Many 

## Future Directions

### Software Directions
- API
- Dropbox
- Google Drive
- Box
- SeaFile
- Further GIS Functionality 

### Python / Django
- Restricting dataset access to those with permission

### JavaScript
- React?
- Vue?
- Redux?

### Docker
- Docker
- Frontend Framework
