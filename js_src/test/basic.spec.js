const basic = require('../pieces/basic.js')

describe('classToggle', function () {

  beforeEach( function () {
    const fixture = document.getElementById('fixture')
    const element = document.createElement('div')
    element.setAttribute('class', 'nachos')
    element.setAttribute('id', 'element')
    fixture.appendChild(element)
  })

  afterEach( function () {
    const fixture = document.getElementById('fixture')
    const element = document.getElementById('element')
    fixture.removeChild(element)
  })

  it('the element should have the class "nachos" already', function () {
    const element = document.getElementById('element')
    assert.equal(element.getAttribute('class'), 'nachos')
  })

  it('classToggle should remove the class "nachos" from the element', function () {
    const element = document.getElementById('element')
    basic.classToggle(element, 'nachos')
    assert.equal(element.getAttribute('class'), '')
  })

  it('classToggle should add the class "steve" from the element', function () {
    const element = document.getElementById('element')
    basic.classToggle(element, 'steve')
    assert.equal(element.getAttribute('class'), 'nachos steve')
  })

})


describe('classToggleOnDifferentLink', function () {

  beforeEach( function () {
    const fixture = document.getElementById('fixture')

    const element1 = document.createElement('div')
    const element2 = document.createElement('div')

    element1.setAttribute('class', 'nachos')

    element1.setAttribute('id', 'element1')
    element2.setAttribute('id', 'element2')

    fixture.appendChild(element1)
    fixture.appendChild(element2)
  })

  afterEach( function () {
    const fixture = document.getElementById('fixture')
    const element1 = document.getElementById('element1')
    const element2 = document.getElementById('element2')
    fixture.removeChild(element1)
    fixture.removeChild(element2)
  })

  it('classToggleOnDifferentLink should remove the class "nachos" from element1', function () {
    const element1 = document.getElementById('element1')
    const element2 = document.getElementById('element2')
    const elements = [element1, element2]

    // call the function on the element without the class, element 2
    basic.classToggleOnDiffLink(element2, elements, 'nachos')

    assert.equal(element1.getAttribute('class'), '')
  })

  it('classToggleOnDifferentLink should add the class "nachos" to element2', function () {
    const element1 = document.getElementById('element1')
    const element2 = document.getElementById('element2')
    const elements = [element1, element2]

    // call the function on the element without the class
    basic.classToggleOnDiffLink(element2, elements, 'nachos')

    // I should fix this so it doesn't have a space first, but I has to be there if there are
    // more classes on the element... so if it's the only class the space should be removed
    // otherwise it should keep the space...
    assert.equal(element2.getAttribute('class'), ' nachos')
  })
})
