// Start with a bunch of stuff from other libraries, then add code from my own libraries
const accountLinks = document.getElementsByName('account')
const accountInfo = document.getElementById('account_info')

// makeReq function
const dataToDiv = (data, div) => {
  div.innerHTML = data
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

// add event that toggles the link's class from active to not active
accountLinks.forEach(link => {
  const account = link.getAttribute('id')
  const url = `/ajax/${account}`

  link.addEventListener('click', () => {
    classToggleOnDiffLink(link, accountLinks, 'active') // this is from index.js
    makeReq(url, dataToDiv, accountInfo)
  })
})

// this is redundant. I don't like it, but it will work for now
// call the classToggle and the makeReq functions on the first
// of the dataset links

//const account = link.getAttribute('id')
//const url = `/ajax/${account}`
const a = accountLinks[0]
const l = a.getAttribute('id')
console.log(l)
const u = `/ajax/${l}`

classToggleOnDiffLink(a, accountLinks, 'active')
makeReq(u, dataToDiv, accountInfo)

