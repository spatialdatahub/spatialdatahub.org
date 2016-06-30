var webdriverio = require('webdriverio')
var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};

webdriverio
    .remote(options)
    .init()
    .url('http://www.zmt-bremen.de/')
    .getTitle().then(function(title) {
        console.log('Title was: ' + title);
    })
    .end();
