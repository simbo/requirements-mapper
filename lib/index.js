'use strict';

var path = require('path'),
    glob = require('glob');

module.exports = (function(){

    return function(dir, globPattern) {

        dir = dir || '.';
        globPattern = globPattern || '**/*.js?(on)';

        var cwd = path.isAbsolute(dir) ? dir : path.join(path.dirname(module.parent.filename), dir),
            globOptions = {
                cwd: cwd
            };

        return glob.sync(globPattern, globOptions).filter(function (node) {
            return !!node;
        }).reduce(function (obj, file) {
            var filePath = path.normalize(file).split(path.sep),
                o = obj;
            filePath.forEach(function (node, j) {
                if (filePath.length-1 > j) {
                    if (!o.hasOwnProperty(node) || !isPlainObject(o[node])) {
                        o[node] = {};
                    }
                    o = o[node];
                }
                else {
                    o[path.basename(node, path.extname(node))] = require(path.join(cwd, file));
                }
            });
            return obj;
        }, {});

    };

})();

function isPlainObject(obj) {
    return typeof obj == 'object' && obj.constructor == Object;
}
