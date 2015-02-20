var express = require('express'),
    staticAsset = require('static-asset'),
    path = require('path'),
    fs = require('fs'),
    jade = require('jade');

var app = express();
app.use(staticAsset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//app.use(function (req, res, next) {
//    var data;
//    try {
//        var template = fs.readFileSync(path.join(__dirname, 'app', 'views', 'layouts', 'application.html.jade'), 'utf8');
//        var view = jade.compile(template);
//        data = view(viewHelpers);
//    } catch (e) {
//        next(e);
//        return;
//    }
//    res.end(data);
//});

app.listen(3000, function (err) {
    if (err) {
        console.error('Failed start server: ' + (err.message || err.toString()));
        process.exit(128);
    }
    console.info('Listening on localhost:3000');
});