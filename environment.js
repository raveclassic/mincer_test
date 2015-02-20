var Mincer = require('mincer');

Mincer.logger.use(console);

var environment = module.exports = new Mincer.Environment(__dirname);

environment.registerEngine('.jsb', require('./lib/browserify-engine'));

environment.enable('source_maps');
environment.appendPath('app/assets/javascripts');
environment.appendPath('app/assets/stylesheets');
environment.appendPath('vendor/assets/javascripts');
environment.appendPath('vendor/assets/stylesheets');
environment.appendPath('bower_components');

environment.ContextClass.defineAssetPath(function (pathname, options) {
	var asset = this.environment.findAsset(pathname, options);
	if (!asset) {
		throw new Error('File ' + pathname + ' not found!');
	}
	return '/assets/' + asset.digestPath;
});

Mincer.MacroProcessor.configure([ '.js', '.css' ]/*, true */);