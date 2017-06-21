// //////// //
// basic.js //
// //////// //

// toggle active / inactive links in list
// almost exactly copied from 'youmightnotneedjquery.com'
const classToggle = function (el, className) {
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


// This one isn't being used right now, but it is useful if there are different choices
// that turn eachother on and off

const classToggleOnDiffLink = function (el, elList, className) {
  // Toggle class on element, but with multiple elements.
  // Click element 1 once to turn class on, and click element 2
  // to turn class off for element 1, and to turn class on
  // for element 2.

  // Just turn class off for everything in element list,
  // and then add class to element that was clicked.

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
const getExt = function (string) {
  const ext = []
  const stringLower = string.toLowerCase()

  stringLower.endsWith('kml')
    ? ext.push('kml')
    : stringLower.endsWith('csv')
      ? ext.push('csv')
      : ext.push('geojson')

  return ext
}

const addButton = function (text, color, container) {
  const btn = document.createElement('button')
  const value = document.createTextNode(text)
  btn.setAttribute('class', 'btn btn-default active') // this should be changed to not active, and the active thing should be added on the specific function
  btn.setAttribute('value', text)
  btn.setAttribute('id', `newbutton${btn.value}`)

  // make the color of the number correspond
  // to the color of the dataset on the map
  btn.style.color = color
  btn.style.fontWeight = 'bold'

  // add text to button and button to div
  btn.appendChild(value)
  container.appendChild(btn)

  return btn
}

/*
// apparently this isn't being used, but it is meant for ajax stuff.
exports.makeReq = function (url, func, div) {
  return fetch(url)
  .then(response => {
    if (!response.ok) {
      console.log('Looks like there has been a problem. Status code:', response.status)
    }
    return response.text()
  })
  .then(data => func(data, div))
  .catch(error => console.log('There has been a problem with the fetch operation: ', error))
}
*/

module.exports = {
  classToggle: classToggle,
  classToggleOnDiffLink: classToggleOnDiffLink,
  getExt: getExt,
  addButton: addButton
}
