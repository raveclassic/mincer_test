'use strict';

module.exports = function (Mincer, sto5) {
	var ES6Engine = function ES6Engine() {
		Mincer.Template.apply(this, arguments);
		sto5 = sto5 || Mincer.Template.libs.sto5 || require('6to5');
	};

	require('util').inherits(ES6Engine, Mincer.Template);

	ES6Engine.prototype.evaluate = function evaluate() {
		this.data = sto5.transform(this.data, { blacklist: ['useStrict'] }).code;
	};

	Mincer.registerEngine('.es6', ES6Engine);
};