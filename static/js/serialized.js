(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

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

/*
function addElement () { 
  // create a new div element 
  var newDiv = document.createElement("div"); 
  // and give it some content 
  var newContent = document.createTextNode("Hi there and greetings!"); 
  // add the text node to the newly created div
  newDiv.appendChild(newContent);  

  // add the newly created element and its content into the DOM 
  var currentDiv = document.getElementById("div1"); 
  document.body.insertBefore(newDiv, currentDiv); 
}

const createButton = buttonText => {
    const b = document.createElement('button');
    const t = document.createTextNode(buttonText);
    b.appendChild(t);
    return b;
};

js_mount.appendChild(createButton("steve"));
********/

// instead of using django template to create the html elements use javascript
// this is basically what react does... do i need react? I don't want to add
// that much js to this project.

/* main container */
// js_mount

/* top bar with functional buttons */

/* sidebar */

/* container with searchbox and clear map button in sidebar */

/* search box */

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
