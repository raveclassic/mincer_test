'use strict';

var util = require('util');

module.exports = React.createClass({
    displayName: 'App',

    getInitialState: function() {
        return {
            name: 'test'
        };
    },

    render: function() {
        return (
            '<div>App</div>'
        )
    }
});