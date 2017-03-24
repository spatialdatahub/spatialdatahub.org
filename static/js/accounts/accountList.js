// Start with a bunch of stuff from other libraries, then add code from my own libraries
const accountLinks = document.getElementsByName('account')
const accountInfo = document.getElementById('account_info')

// this is just calling the functions, nothing new here
// add event that toggles the link's class from active to not active
accountLinks.forEach(link => {
  const account = link.getAttribute('id')
  const url = `/account_ajax/${account}`

  link.addEventListener('click', () => {
    classToggleOnDiffLink(link, accountLinks, 'active') // this is from index.js
    makeReq(url, dataToDiv, accountInfo)
  })
})

// this is redundant. I don't like it, but it will work for now
// call the classToggle and the makeReq functions on the first
// of the dataset links

// const account = link.getAttribute('id')
// const url = `/ajax/${account}`
const a = accountLinks[0]
const l = a.getAttribute('id')
const u = `/account_ajax/${l}`

classToggleOnDiffLink(a, accountLinks, 'active')
makeReq(u, dataToDiv, accountInfo)
