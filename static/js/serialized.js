(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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

var makeDiv = function makeDiv(cls, id) {
  var div = document.createElement('div');
  div.setAttribute('class', cls);
  div.setAttribute('id', id);
  return div;
};

var makeUl = function makeUl(cls, id) {
  var ul = document.createElement('ul');
  ul.setAttribute('class', cls);
  ul.setAttribute('id', id);
  return ul;
};

var makeLi = function makeLi(cls, id) {
  var li = document.createElement('li');
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
var mapContainerJS = makeDiv('col-xs-12 col-md-8 col-lg-9', 'mapContainerJS');

// put in placeholder text
var mapContainerPlaceholder = document.createTextNode('Map Here');
mapContainerJS.appendChild(mapContainerPlaceholder);

// append to js_mount div
js_mount.appendChild(mapContainerJS);

/* sidebar */
// create sidebar container for datsets
var datasetsContainerJS = makeDiv('col-xs-12 col-md-4 col-lg-3', 'datasetsContainerJS');

// put in placeholder text
var datasetsContainerPlaceholder = document.createTextNode('Sidebar Here');
datasetsContainerJS.appendChild(datasetsContainerPlaceholder);

// append to js_mount div
js_mount.appendChild(datasetsContainerJS);

/* container with searchbox and clear map button in sidebar */
var searchBarClearMapUl = makeUl('nav nav-pils nav-stacked', 'searchBarClearMapUl');

/* search bar */
var searchBarLi = makeLi('', 'searchBarLi');

/* make all the stuff that goes into the search bar */
var searchBarForm = document.createElement('form');
searchBarForm.setAttribute('action', '.');
searchBarForm.setAttribute('method', 'GET');

var searchBarFormInput = document.createElement('input');
searchBarFormInput.setAttribute('class', 'form-control');
searchBarFormInput.setAttribute('name', 'q');
searchBarFormInput.setAttribute('type', 'text');
searchBarFormInput.setAttribute('title', 'Search Datasets');
searchBarFormInput.setAttribute('placeholder', 'Search title, account, author, keyword');

/* append it to searchBarLi and then to js_mount */
/* append it to searchBarClearMapUl */
datasetsContainerJS.appendChild(searchBarClearMapUl.appendChild(searchBarLi.appendChild(searchBarForm.appendChild(searchBarFormInput))));

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

},{}]},{},[1]);
