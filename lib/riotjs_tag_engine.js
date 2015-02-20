'use strict';

module.exports = function (Mincer, riot) {
	var TagEngine = function TagEngine() {
		Mincer.Template.apply(this, arguments);
		riot = riot || Mincer.Template.libs.riot || require('riot');
	};

	require('util').inherits(TagEngine, Mincer.Template);

	TagEngine.prototype.evaluate = function evaluate() {
		this.data = riot.compile(this.data, {type: 'es6'});
	};

	Mincer.registerEngine('.tag', TagEngine);
};