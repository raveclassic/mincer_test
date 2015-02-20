'use strict';

var path = require('path'),
    source = require('vinyl-source-stream'),
    tap = require('gulp-tap'),
    mkdirp = require('mkdirp'),
    fs = require('fs'),
    shelljs = require('shelljs'),
    util = require('util'),
    Mincer = require('mincer'),
    Browserify = (Mincer.Template.libs.browserify || require('browserify'));

var TEMP_PATH = path.join('tmp', 'browserify-mincer'),
    TMP_DIR = 'tmp/browserify-mincer',
    NODE_BIN = 'node_modules/.bin',
    BROWSERIFY_CMD = path.join(NODE_BIN, 'browserify'),
    BROWSERIFYINC_CMD = path.join(NODE_BIN, 'browserifyinc'),

    OUTPUT_FILE = nodePath(TMP_DIR, 'output');

var BrowserifyEngine = module.exports = function BrowserifyEngine() {
    Mincer.Template.apply(this, arguments);
    ensureTmpDirExists();
    ensureCommandExist();
};

util.inherits(BrowserifyEngine, Mincer.Template);

util._extend(BrowserifyEngine.prototype, {
    evaluate: function (context, locals) {
        //If there's nothing to do, we just return the data we received
        if (!this.shouldBrowserify(context, this.file, this.data)) return;

        //Signal dependencies to sprockets to ensure we track changes
        this.trackDependencies(context);

        this.data = this.transform(context);
    },

    transform: function(context) {
        fs.closeSync(fs.openSync(OUTPUT_FILE, 'w'));
        runBrowserify(context.__logicalPath__, " -o \"" + OUTPUT_FILE + "\"");

        return fs.readFileSync(OUTPUT_FILE).toString();
    },

    shouldBrowserify: function(context) {
        return this.isInPath(context) && !this.isBrowserified() && this.isCommonjsModule(context);
    },

    isInPath: function(context) {
        var self = this;
        return context.environment.__trail__.__paths__.some(function (path) {
            return self.file.indexOf(path) === 0;
        });
    },

    isCommonjsModule: function(context) {
        return this.data.indexOf('module.exports') != -1 || !!this.data && this.getDependencies().length > 0;
    },

    isBrowserified: function() {
        return this.data.indexOf('define.amd') != -1 || this.data.indexOf('_dereq_') != -1;
    },

    trackDependencies: function(context) {
        this.getDependencies().filter(function (path) {
            //check if path starts with one of assetPaths
            return context.environment.__trail__.__paths__.some(function (assetPath) {
                return path.indexOf(assetPath) === 0;
            });
        }).map(context.dependOn);
    },

    getDependencies: function() {
        if (!!this.dependencies) return this.dependencies;

        var list = runBrowserify(undefined, "--list");

        return this.dependencies = list.split('\n').filter(function (line) {
            return fs.existsSync(line.trim());
        });
    }
});

function ensureTmpDirExists() {
    mkdirp(nodePath(TMP_DIR));
}

function ensureCommandExist() {
    var error = function (cmd) {
        return "Unable to run " + cmd + ". Ensure you have installed it with npm.";
    };

    //Browserify has to be installed in any case
    if (!fs.existsSync(nodePath(BROWSERIFY_CMD))) {
        throw new Error(error.call(BROWSERIFY_CMD));
    }

    //If the user wants to use browserifyinc, we need to ensure it's there too
    //if config.use_browserifyinc && !File.exists?(rails_path(BROWSERIFYINC_CMD))
    //    raise BrowserifyRails::BrowserifyError.new(error.call(BROWSERIFYINC_CMD))
    //end
}

function nodePath() {
    var paths = Array.prototype.slice.call(arguments);
    paths.unshift(path.normalize(path.dirname(require.main.filename)));
    return path.join.apply(path, paths);
}


/**
 * Run the requested version of browserify (browserify or browserifyinc)
 * based on configuration or the use_browserifyinc parameter if present.
 *
 * We are passing the data via stdin, so that earlier preprocessing steps are
 * respected. If you had, say, an "application.js.coffee.erb", passing the
 * filename would fail, because browserify would read the original file with
 * ERB tags and fail. By passing the data via stdin, we get the expected
 * behavior of success, because everything has been compiled to plain
 * javascript at the time this processor is called.
 *
 * @param logical_path Sprockets's logical path for the file
 * @param extra_options Options to be included in the command
 * @param force_browserifyinc Causes browserifyinc to be used if true
 * @returns {string[]} Output of the command
 */
function runBrowserify(logicalPath, commandOptions) {

    //# Browserifyinc uses a special cache file. We set up the path for it if
    //    # we're going to use browserifyinc.
    //if uses_browserifyinc(force_browserifyinc)
    //    cache_file_path = rails_path(TMP_PATH, "browserifyinc-cache.json")
    //command_options << " --cachefile=#{cache_file_path.inspect}"
    //end

    //# Create a temporary file for the output. Such file is necessary when
    //# using browserifyinc, but we use it in all instances for consistency
    var command = nodePath(BROWSERIFY_CMD) + " " + commandOptions;

    console.log("Executing command: ", command);
    var result = shelljs.exec(command);
    if (result.code != 0) {
        throw new Error("Error while running `" + command + "`:\nCode: " + result.code + "\n" + "Output:" + result.output + "\n\n");
    }

    return result.output;
}


