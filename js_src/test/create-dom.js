/* create dom */

document.getElementsByTagName('html')[0].style.width = '100%'
document.getElementsByTagName('html')[0].style.height = '100%'
document.getElementsByTagName('body')[0].style.width = '100%'
document.getElementsByTagName('body')[0].style.height = '100%'
document.getElementsByTagName('body')[0].style.margin = '0'
document.getElementsByTagName('body')[0].style.padding = '0'

// fixture container
var fixture = document.createElement('div')
fixture.id = 'fixture'
document.body.appendChild(fixture)

// map container
document.body.innerHTML += '<div id="mapid" style="height: 50%; width: 100%;"></div>'
