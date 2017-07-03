const filterize = require('../pieces/filterize.js')

describe('filterize.js', function () {

  const points = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "Title": "Example Point",
          "Year": 2017
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            53.78906249999999,
            43.32517767999296
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "hey": "now now",
          "Year": 2000
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            4.921875,
            49.61070993807422
          ]
        }
      }
    ]
  }

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

  describe('getFeaturePropertyKeys', function () {
    it('should return array of unique keys from geojson feature properties', function () {
      assert.deepEqual(
        filterize.getFeaturePropertyKeys(points),
        ["Title", "Year", "hey"]
      )
    })
  })


  describe('featurePropertiesInclude', function () {

      const expected = {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {
              "hey": "now now",
              "Year": 2000
            },
            "geometry": {
              "type": "Point",
              "coordinates": [
                4.921875,
                49.61070993807422
              ]
            }
          }
        ]
      }

    it('should return geojson object with feature props that include particular string', function () {
      assert.deepEqual(
        filterize.featurePropertiesInclude("now", points),
        expected
      )
    })

    it('shoud return geojson object with feature props that include particular number', function () {
      assert.deepEqual(
        filterize.featurePropertiesInclude(2000, points),
        expected
      )
    })
  })


  describe('makePropertySelector', function () {
    // Array    
    const propertyArray = ["Title", 2017]

    // pre-built slector with two options
    const expect = document.createElement('selector')
    const text1 = document.createTextNode('Title')
    const text2 = document.createTextNode(2017)
    const option1 = document.createElement('option') 
    const option2 = document.createElement('option') 
    option1.value = "Title"
    option1.appendChild(text1)
    option2.value = 2017
    option2.appendChild(text2)
    expect.appendChild(option1)
    expect.appendChild(option2)
    
    it('should build selector and assign options to feature collection properties', function () {
      const tester = filterize.makePropertySelectorOptions(propertyArray)
      assert.deepEqual(tester, expect) 
    })
  })

})
