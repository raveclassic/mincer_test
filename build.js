var browserify = require('browserify'),
    synchronize = require('synchronize'),
    through = require('through'),
    tap = require('gulp-tap');

var bundle = browserify();
bundle.add('./app/assets/javascripts/test.js');
pipe = bundle.bundle();

function readPipe(cb) {
    "use strict";

}


pipe.pipe(tap(function(data) {
    "use strict";
    console.log('data', data);
}))
.pipe(process.stdout);