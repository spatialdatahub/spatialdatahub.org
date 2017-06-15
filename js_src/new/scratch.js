const myMap = new L.Map('mapid', {
  center: {lat: 38, lng: 0},
  zoom: 2
})

const square = n => n*n
const obj = {1: 'a', 2: 'b', 3: 'c'}
const keys = Object.keys(obj)
// const vals = Object.values(obj) // this doesn't work with firefox unless there is a polyfill

module.exports = {
  myMap: myMap,
  square: square,
  obj: obj,
  keys: keys
}
