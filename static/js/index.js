// ////////////////////////////////////////////////////////////////////////////
/*
// CUSTOM FUNCTIONS
*/
// ////////////////////////////////////////////////////////////////////////////

// function to add data to a container
// is this function completely unnecessary?
const addDataToContainer = (data, obj, key) => obj[key] = data

// this should probably be in the index of helper functions
// makeReq function
const dataToDiv = (data, div) => div.innerHTML = data

// toggle active / inactive links in list
// almost exactly copied from 'youmightnotneedjquery.com'
const classToggle = (el, className) => {
  /*
    Toggle class on element. Click element once to turn it on,
    and again to turn it off, or vis versa.
  */
  if (el.classList) {
    el.classList.toggle(className)
  } else {
    const classes = el.className.split(' ')
    const existingIndex = classes.indexOf(className)
    if (existingIndex >= 0) {
      classes.splice(existingIndex, 1)
    } else {
      classes.push(className)
    }
    el.className = classes.join(' ')
  }
}

const classToggleOnDiffLink = (el, elList, className) => {
  /*
    Toggle class on element, but with multiple elements.
    Click element 1 once to turn class on, and click element 2
    to turn class off for element 1, and to turn class on
    for element 2.

    Just turn class off for everything in element list,
    and then add class to element that was clicked.
  */

  // first remove className from all elements
  elList.forEach(e => {
    if (e.classList) {
      e.classList.remove(className)
    }
  })

  // then add className to element that was clicked
  const classes = el.className.split(' ')
  classes.push(className)
  el.className = classes.join(' ')
}

// make function that gets the ext of the url
// it can handle csv, kml, json, and geojson
const getExt = string => {
  const ext = {}
  const stringLower = string.toLowerCase()
  stringLower.endsWith('kml')
  ? ext[0] = 'kml'
  : stringLower.endsWith('csv')
  ? ext[0] = 'csv'
  : stringLower.endsWith('json')
  ? ext[0] = 'geojson'
  : console.log(stringLower)
  return ext[0]
}

// make function for adding buttons
const addButton = (text, color, container) => {
  const btn = document.createElement('button')
  const value = document.createTextNode(text)
  btn.setAttribute('class', 'btn btn-default active')
  btn.setAttribute('value', text)

  // make the color of the number correspond
  // to the color of the dataset on the map
  btn.style.color = color
  btn.style.fontWeight = 'bold'

  // add text to button and button to div
  btn.appendChild(value)
  container.appendChild(btn)

  return btn
}

// make ajax request function here, then move it to the index.js
const makeReq = (url, func, div) => {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.onload = () => {
    xhr.readyState === 4 && xhr.status === 200
    ? func(xhr.responseText, div)
    : console.log(xhr.statusText)
  }
  xhr.onerror = () => console.log('error')
  xhr.send()
}

// export all the functions to node for testing
if (typeof exports !== 'undefined') {
  exports.addDataToContainer = addDataToContainer
  exports.dataToDiv = dataToDiv
  exports.classToggle = classToggle
  exports.classToggleOnDiffLink = classToggleOnDiffLink
}
