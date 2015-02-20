'use strict';

module.exports = function(Mincer, babel) {
    var BabelEngine = function BabelEngine() {
        Mincer.Template.apply(this, arguments);
        babel = babel || Mincer.Template.libs.babel || require('babel');
    };

    require('util').inherits(ES6Engine, Mincer.Template);

    ES6Engine.prototype.evaluate = function evaluate() {
        this.data = babel.transform(this.data, { blacklist: ['useStrict'] }).code;
    };

    Mincer.registerEngine('.es6', ES6Engine);
};