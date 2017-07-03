const L = require('leaflet')
const editMap = require('../pieces/editMap.js')

describe('editMap', function () {
  describe('showPlaceContainer', function () {
    beforeEach(function () {
      const fixture = document.getElementById('fixture')
      const element = document.createElement('div')
      element.setAttribute('id', 'element')
      element.setAttribute('style', 'display: ')
      fixture.appendChild(element)
    })

    afterEach(function () {
      const fixture = document.getElementById('fixture')
      const element = document.getElementById('element')
      fixture.removeChild(element)
    })

    it('should change element display style from "" to "block"', function () {
      const element = document.getElementById('element')
      editMap.showPlaceContainer(element)
      assert.equal(element.getAttribute('style'), 'display: block;')
    })

    it('should change element display style from "none" to "block"', function () {
      const element = document.getElementById('element')
      element.setAttribute('style', 'display: none')
      editMap.showPlaceContainer(element)
      assert.equal(element.getAttribute('style'), 'display: block;')
    })
  })

  describe('getSelectedPlacePolygon', function () {

    // triangle polygon
    const poly = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -18.544921875,
                  29.53522956294847
                ],
                [
                  -8.9208984375,
                  22.30942584120019
                ],
                [
                  -9.31640625,
                  31.39115752282472
                ],
                [
                  -18.544921875,
                  29.53522956294847
                ]
              ]
            ]
          }
        }
      ]
    }

    const line = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": [
              [
                -13.9306640625,
                33.87041555094183
              ],
              [
                2.4609375,
                27.72243591897343
              ]
            ]
          }
        }
      ]
    }

    const point = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [
              -4.482421875,
              38.65119833229951
            ]
          }
        }
      ]
    }

    const polyLayer = L.geoJson(poly)
    const lineLayer = L.geoJson(line)
    const pointLayer = L.geoJson(point)

    const arr = []

    afterEach(function () {
      arr.pop()
    })

    it('should return "not a polygon" if given a point layer', function () {
      arr.push(pointLayer)
      assert.equal(editMap.getSelectedPlacePolygon(arr), 'not a polygon')
    })

    it('should return "not a polygon" if given a line layer', function () {
      arr.push(lineLayer)
      assert.equal(editMap.getSelectedPlacePolygon(arr), 'not a polygon')
    })

//    it('should return "Polygon" polygon layer', function () {
//      arr.push(polyLayer)
//      assert.equal(editMap.getSelectedPlacePolygon(arr), 'Polygon')
//    })
  })
})
