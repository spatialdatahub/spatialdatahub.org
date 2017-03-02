// CUSTOM FUNCTIONS

// toggle active / inactive links in list
// almost exactly copied from 'youmightnotneedjquery.com'
const classToggle = (el, className) => {
  if (el.classList) {
    el.classList.toggle(className) 
  } else {
    const classes = el.className.split(' ') 
    const existingIndex = classes.indexOf(className) 
    if (existingIndex >= 0)
      classes.splice(existingIndex, 1) 
    else
      classes.push(className) 
    el.className = classes.join(' ') 
  }
}
