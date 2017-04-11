describe('Tests for the functions in the index.js', function() {
  // this should probably be removed... it's not an important function
  describe('dataToDiv', function() {
    it('is used to add data to html elements, or anything really', () => {
      const div = document.createElement('div')
      const data = 'hey'
      dataToDiv(data, div)
      assert.equal(div.innerHTML, 'hey')
    })
  })

  describe('classToggle', function() {
    it('should add the class "super"', function() {
      const div = document.createElement('div')
      div.className = ''
      classToggle(div, 'super')
      assert.equal(div.className, 'super')
    })

    it('should remove the class "super"', function() {
      const div = document.createElement('div')
      div.className = 'super'
      classToggle(div, 'super')
      assert.equal(div.className, '')
    })
  })

  describe('classToggleOnDiffLink', function() {
    describe('when divs do not have targeted class', function() {
      const div1 = document.createElement('div')  
      const div2 = document.createElement('div')  
      div1.className = '' 
      div2.className = '' 
      const classes = [div1, div2]
      classToggleOnDiffLink(div1, classes, 'super')

      it('should add the class "super" to div1', function() {
        assert(div1.className.includes('super'), 'assert the className includes "super"')
      })

      it('should not add the class "super" to div2', function() {
        assert.equal(div2.className, '')
      })

    })

    describe('when one of the divs has the targeted class', function() {
      const div1 = document.createElement('div')  
      const div2 = document.createElement('div')  
      div1.className = 'super' 
      div2.className = '' 
      const classes = [div1, div2]
      classToggleOnDiffLink(div2, classes, 'super')

      it('should remove the class "super" from div1', function() {
        assert.equal(div1.className, '')
      })

      it('should add the class "super" to div2', function() {
        assert(div2.className.includes('super'), 'assert the className includes "super"')
      })
    })
  })
})
