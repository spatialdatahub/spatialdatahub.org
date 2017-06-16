// Karma configuration
// Generated on Wed Jun 07 2017 15:51:27 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'mocha', 'sinon-chai'],

    // chai config
    client: {
      chai: {
        includeStack: true
      }
    },


    // list of files / patterns to load in the browser
    files: [
      // create DOM
      'js_src/test/create-dom.js',

      // dependencies
      {pattern: 'node_modules/leaflet/dist/leaflet.css'},
//      {pattern: 'node_modules/leaflet/dist/leaflet.js'}, // This is being 'required' in the script

      // my scripts
      'js_src/new/scratch.js',
      'js_src/pieces/basic.js',
      'js_src/pieces/mapFunctions.js',

      // test files
      'js_src/test/scratch.spec.js',
      'js_src/test/basic.spec.js',
      'js_src/test/mapFunctions.spec.js'
    ],


    // list of files to exclude
    exclude: [
      '**/*.swp'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'js_src/new/scratch.js': [ 'browserify' ],
      'js_src/pieces/basic.js': [ 'browserify' ],
      'js_src/pieces/mapFunctions.js': [ 'browserify' ],

      'create-dom.js': [ 'browserify' ],
      'js_src/test/scratch.spec.js': [ 'browserify' ],
      'js_src/test/basic.spec.js': [ 'browserify' ],
      'js_src/test/mapFunctions.spec.js': [ 'browserify' ]
    },

    browserify: {
      debug: true,
      transform: [ 'babelify' ]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox', 'Opera'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
