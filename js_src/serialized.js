/*
  Rewriting the main js file to deal with serialized data instead of pulling it from html elements
  */

/*
const colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red']
let linkDatasetColorCounter = 0 // this is for the datasets from the links

const datasetLinksNodeList = document.getElementsByName('dataset')
const datasetLinks = Array.prototype.slice.call(datasetLinksNodeList)
const datasets = {}
const datasetClusters = {}
const activeDatasetButtons = []
let layerClusterState = 0

dataset links for each
  const pk = link.id
  const ext = link.getAttribute('value') // I have to use this because 'value' is a loaded arguement
  const url = mapFunctions.returnCorrectUrl(link, pk)

  leaflet map
  enter keycode
  
It looks like I need dataset primary keys, slugs, urls, ext 

  */

console.log(json_data);
console.log(js_mount);


const makeDiv = (cls, id) => {
    const div = document.createElement('div');
    div.setAttribute('class', cls);
    div.setAttribute('id', id);
    return div;
};

const makeUl = (cls, id) => {
    const ul = document.createElement('ul');
    ul.setAttribute('class', cls);
    ul.setAttribute('id', id);
    return ul;
};

const makeLi = (cls, id) => {
    const li = document.createElement('li');
    li.setAttribute('class', cls);
    li.setAttribute('id', id);
    return li;
};



// instead of using django template to create the html elements use javascript
// this is basically what react does... do i need react? I don't want to add
// that much js to this project.

/* main container */
// js_mount

/* top bar with functional buttons */
  /* div */

  /* buttons */

/* main map container */
// create map container with classes and id
const mapContainerJS = makeDiv('col-xs-12 col-md-8 col-lg-9', 'mapContainerJS');

// put in placeholder text
const mapContainerPlaceholder = document.createTextNode('Map Here');
mapContainerJS.appendChild(mapContainerPlaceholder);

// append to js_mount div
js_mount.appendChild(mapContainerJS);

/* sidebar */
// create sidebar container for datsets
const datasetsContainerJS = makeDiv('col-xs-12 col-md-4 col-lg-3', 'datasetsContainerJS');

// put in placeholder text
const datasetsContainerPlaceholder = document.createTextNode('Sidebar Here');
datasetsContainerJS.appendChild(datasetsContainerPlaceholder);

// append to js_mount div
js_mount.appendChild(datasetsContainerJS);

/* container with searchbox and clear map button in sidebar */
const searchBarClearMapUl = makeUl('nav nav-pils nav-stacked', 'searchBarClearMapUl');

  /* search bar */
  const searchBarLi = makeLi('', 'searchBarLi');

    /* make all the stuff that goes into the search bar */
    const searchBarForm = document.createElement('form');
    searchBarForm.setAttribute('action', '.');
    searchBarForm.setAttribute('method', 'GET');

    const searchBarFormInput = document.createElement('input');
    searchBarFormInput.setAttribute('class', 'form-control');
    searchBarFormInput.setAttribute('name', 'q');
    searchBarFormInput.setAttribute('type', 'text');
    searchBarFormInput.setAttribute('title', 'Search Datasets');
    searchBarFormInput.setAttribute('placeholder', 'Search title, account, author, keyword');

    /* append it to searchBarLi and then to js_mount */
    /* append it to searchBarClearMapUl */
datasetsContainerJS.appendChild(
  searchBarClearMapUl.appendChild(
    searchBarLi.appendChild(
      searchBarForm.appendChild(searchBarFormInput)
    )   
  )   
);



   /* clear map button */

/* add data to map buttons in side bar */
/* container for map buttons and dataset page links in side bar */

/* dataset has password */
/*
  <div class="btn-group" role="group">
    <button type="button" class="btn btn-default"
      name="dataset" id="pk" value="ext">
        dataset.title
    </button>
  </div>
*/

/* dataset does not have password */
/*
  <div class="btn-group" role="group">
    <button type="button" class="btn btn-default"
      name="dataset" id="pk" value="ext" url="url">
        dataset.title
    </button>
  </div>
*/

  
/**/

/* dataset page links in side bar */

/* map container */

/* map */

