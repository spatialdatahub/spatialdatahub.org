// CUSTOM FUNCTIONS
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


if(typeof exports !== 'undefined') {
  exports.classToggle = classToggle
  exports.classToggleOnDiffLink = classToggleOnDiffLink
}
