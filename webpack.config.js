var path = require('path');

module.exports = {
    entry: './app/assets/application.js.coffee',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'application.js'
    }
};