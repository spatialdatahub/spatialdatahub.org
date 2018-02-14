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






const makeElement = (element, cls, id) => {
    const el = document.createElement(element);
    el.setAttribute('class', cls);
    el.setAttribute('id', id);
    return el;
};

// So, instead of breaking this into many files, then calling them, which may actually be good, I am going to
// break it up into sections, starting with the smallest parts first


// instead of using django template to create the html elements use javascript
// this is basically what react does... do i need react? I don't want to add
// that much js to this project.

// main container
// js_mount

// top bar with functional buttons
  // div

  // buttons

// main map container
// create map container with classes and id and a placeholder text element
const mapContainerJS = makeElement('div', 'col-xs-12 col-md-8 col-lg-9', 'mapContainerJS');
const mapId = makeElement('div', 'custom-popup', 'mapid');
//const mapContainerPlaceholder = document.createTextNode('Map Here');

// sidebar 
// create sidebar container for datasets
const datasetsContainerJS = makeElement('div', 'col-xs-12 col-md-4 col-lg-3', 'datasetsContainerJS');

// container with searchbox and clear map button in sidebar
const searchBarClearMapUl = makeElement('ul', 'nav nav-pils nav-stacked', 'searchBarClearMapUl');

// search bar
const searchBarLi = makeElement('li', 'searchBarLi', 'searchBarLi');

// make the form that goes into the searchBarLi
const searchBarForm = document.createElement('form');
searchBarForm.setAttribute('action', '.');
searchBarForm.setAttribute('method', 'GET');

// make the input that will go into the searchBarform
const searchBarFormInput = document.createElement('input');
searchBarFormInput.setAttribute('class', 'form-control');
searchBarFormInput.setAttribute('name', 'q');
searchBarFormInput.setAttribute('type', 'text');
searchBarFormInput.setAttribute('title', 'Search Datasets');
searchBarFormInput.setAttribute('placeholder', 'Search title, account, author, keyword');

// make the clear map button
// make li
const clearMapLi = makeElement('li', 'clearMapLi', 'clearMapLi');
// make button
const clearMapButton = makeElement('button', 'btn btn-default btn-block', 'clear_map');
/* make textNode */
const clearMapButtonText = document.createTextNode('Clear Map');

// puting it all together

// start with the Search Bar and Clear Map elements
// append the searchBarFormInput to the searchBarForm
searchBarForm.appendChild(searchBarFormInput);
// append the searchBarForm to the searchBarLi
searchBarLi.appendChild(searchBarForm);
// append the searchBarLi to the searchBarUl
searchBarClearMapUl.appendChild(searchBarLi); 

// append the clearMapButtonText to the clearMapButton
clearMapButton.appendChild(clearMapButtonText);
// append the clearMapButton to the clearMapButtonLi
clearMapLi.appendChild(clearMapButton);
// append the clearMapButtonLi to the sidebar
searchBarClearMapUl.appendChild(clearMapLi);

// append the searchBarClearMapUl to the datasetsContainer
datasetsContainerJS.appendChild(searchBarClearMapUl);

// append the mapContainerPlaceholder to the mapContainer
mapContainerJS.appendChild(mapId);

// append the sidebar to js_mount
js_mount.appendChild(datasetsContainerJS);

// append the map container to js_mount
js_mount.appendChild(mapContainerJS);

// do some of the other stuff
// this is why things get broken up in react.
json_data.map(dataset => console.log(dataset));

const datasetButtons = json_data.map(dataset => {
    // make the justified button group div
    const justifiedButtonGroup = makeElement('div', 'btn-group btn-group-justified', `justifiedButtonGroup${dataset.pk}`);
    justifiedButtonGroup.setAttribute('role', 'group');

    // make the button group div
    const buttonGroup = makeElement('div', 'btn-group', `buttonGroup${dataset.pk}`);
    buttonGroup.setAttribute('role', 'group');

    // make the button for the dataset
    // a lot of this will change with refactorin
    const button = makeElement('button', 'btn btn-default', `button${dataset.pk}`);
    button.setAttribute('type', 'button');
    button.setAttribute('name', 'dataset'); // is this necessary?
    button.setAttribute('value', `${dataset.fields.ext}`); // is this necessary?
    button.setAttribute('url', `${dataset.fields.url}`); // is this necessary?

    // make the text node for the button for the dataset
    const buttonText = document.createTextNode(`${dataset.fields.title}`);

    // make the button group div for the link to the dataset page
    const datasetLinkButtonGroup = makeElement('div', 'btn-group', `datasetLinkButtonGroup${dataset.pk}`);

    // make the link to the dataset page
    const datasetLink = makeElement('a', 'btn', `datasetLink${dataset.pk}`);
    datasetLink.setAttribute('href', `/${dataset.fields.account}/${dataset.fields.dataset_slug}/${dataset.pk}/`);

    // make the text for the link to the dataset page
    const datasetLinkText = document.createTextNode('Dataset Page');

    // put it all together
    // dataset to map button
    button.appendChild(buttonText);
    buttonGroup.appendChild(button);
    justifiedButtonGroup.appendChild(buttonGroup);

    // dataset page link
    datasetLink.appendChild(datasetLinkText);
    datasetLinkButtonGroup.appendChild(datasetLink);
    justifiedButtonGroup.appendChild(datasetLinkButtonGroup);

    // return as array of divs
    return justifiedButtonGroup;
});

// add the dataset buttons to the sidebar container
datasetButtons.forEach(datasetButton => datasetsContainerJS.appendChild(datasetButton));


