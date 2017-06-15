const basic = require('../pieces/basic.js')

describe('Smoke', function () {
  it('assert that 2+2 is 4', function () {
    assert.equal(2+2, 4)
  })
})

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
    console.log(element)
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


