'use_strict';

var path = require('path'),
    fs = require('fs'),
    Mincer = require('mincer'),
    connect = require('connect'),
    jade = require('jade');

require('./lib/riotjs_tag_engine')(Mincer);
require('./lib/es6_engine')(Mincer);
require('mincer-jsx')(Mincer);

var environment = require('./environment');

var app = connect();
app.use('/assets', Mincer.createServer(environment));

function rewrite_extension(source, ext) {
    "use strict";
    return path.extname(source) === ext ? source : (source + ext);
}

var viewHelpers = {
    javascript: function (logicalPath) {
        "use strict";
        var asset = environment.findAsset(logicalPath);
        if (!asset) {
            return '<script type="text/javascript">alert("Javascript file ' + JSON.stringify(logicalPath).replace(/"/g, '\\"').replace(/'/g, '\\\'') + ' not found");</script>';
        }
        return '<script type="text/javascript" src="/assets/' + rewrite_extension(asset.digestPath, '.js') + '"></script>';
    },
    stylesheet: function (logicalPath) {
        "use strict";
        var asset = environment.findAsset(logicalPath);
        if (!asset) {
            return '<script type="text/javascript">alert("Stylesheet file ' + JSON.stringify(logicalPath).replace(/"/g, '\\"') + ' not found");</script>';
        }
        return '<link rel="stylesheet" type="text/css" href="/assets/' + rewrite_extension(asset.digestPath, '.css') + '"/>';
    }
};

app.use(function (req, res, next) {
    var data;
    try {
        var template = fs.readFileSync(path.join(__dirname, 'app', 'views', 'layouts', 'application.html.jade'), 'utf8');
        var view = jade.compile(template);
        data = view(viewHelpers);
    } catch (e) {
        next(e);
        return;
    }
    res.end(data);
});

app.listen(3000, function (err) {
    if (err) {
        console.error('Failed start server: ' + (err.message || err.toString()));
        process.exit(128);
    }
    console.info('Listening on localhost:3000');
});