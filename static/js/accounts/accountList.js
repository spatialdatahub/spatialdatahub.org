// Start with a bunch of stuff from other libraries, then add code from my own libraries
const accountLinks = document.getElementsByName('account')
const accountInfo = document.getElementById('account_info')

// makeReq function 
const dataToDiv = (data, div) => div.innerHTML = data

// make ajax request function here, then move it to the index.js
const makeReq = (url, func, div) => {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.onload = () => {
    xhr.readyState === 4 && xhr.status === 200
      func(xhr.responseText, div)
  }
  xhr.onerror = () => console.log('error')
  xhr.send()
}

// add event that toggles the link's class from active to not active
accountLinks.forEach(link => {
  const account = link.getAttribute('id')
  const url = `/ajax/${account}`

  link.addEventListener('click', () => {
    classToggle(link, 'active')
    makeReq(url, dataToDiv, accountInfo) 
  })
})

