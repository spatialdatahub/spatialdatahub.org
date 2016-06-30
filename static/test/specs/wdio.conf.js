var assert = require('assert');

describe('webdriver.io page', function() {
    it('should have the right title - the fancy generator way', function() {
        browser.url('http://webdriver.io');
        var title = browser.getTitle();
        assert.equal(title, 'WebdriverIO - Selenium 2.0 javascript bindings for nodejs');
    });
});

describe('DuckDuckgo search', function() {
    it('searches for WebdriverIO', function() {
        browser.url('https://duckduckgo.com/');
        browser.setValue('#search_form_input_homepage', 'WebdriverIO');
        browser.click('#search_button_homepage');

        var title = browser.getTitle();
        assert.notEqual(title, 'Webdriver');
        console.log('Title is: ' + title);
    });
});
