// I need to make the code for lists consistent. That will be another day

const selectedLinkContainer = document.getElementById('selected_link_container')

// Start with a bunch of stuff from other libraries, then add code from my own libraries
const accountLinks = document.getElementsByName('account')
const accountInfo = document.getElementById('account_info')

// this is just calling the functions, nothing new here
// add event that toggles the link's class from active to not active
accountLinks.forEach(function handleLink(link) => {
  const account = link.getAttribute('id')
  const url = `/account_ajax/${account}`
  const absoluteUrl = link.getAttribute('link')
  const text = link.children[0].text
  const selectedLink = `<a href='${absoluteUrl}'>Go to ${text}'s account</a>`

  link.addEventListener('click', function linkEvent() {
    classToggleOnDiffLink(link, accountLinks, 'active') // this is from index.js
    makeReq(url, dataToDiv, accountInfo)
    selectedLinkContainer.innerHTML = selectedLink
  })
})

// this is redundant. I don't like it, but it will work for now
// call the classToggle and the makeReq functions on the first
// of the dataset links

const a = accountLinks[0]
const l = a.getAttribute('id')
const u = `/account_ajax/${l}`

classToggleOnDiffLink(a, accountLinks, 'active')
makeReq(u, dataToDiv, accountInfo)
