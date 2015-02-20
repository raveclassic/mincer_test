var browserify = require('browserify'),
    watchify = require('watchify'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    path = require('path');

var sourceFile = './app/assets/javascripts/application.js.coffee',
    destFolder = './build/',
    destFile = 'application.js';