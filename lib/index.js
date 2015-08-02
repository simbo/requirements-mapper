'use strict';

var path = require('path'),
    glob = require('glob');

/**
 * RequirementsMapper constructor
 * @param {String}       dir          directory to map
 * @param {String|Array} globPattern  glob pattern(s)
 */
function RequirementsMapper(dir, globPattern) {
    this.dir = dir || '.';
    this.globPattern = globPattern || '**/*.js?(on)';
    this.cwd = path.isAbsolute(this.dir) ? this.dir : path.join(path.dirname(module.parent.filename), this.dir);
    this.globOptions = {};
}

/**
 * create requirements object
 * @return {Object}  plain object containing required matches
 */
RequirementsMapper.prototype.map = function() {
    this.globOptions.cwd = this.cwd;
    return glob.sync(this.globPattern, this.globOptions).reduce(function(obj, file) {
            this.node = obj;
            this.file = file;
            this.filePath = path.normalize(file).split(path.sep);
            this.filePath.filter(function(node) {
                return !!node;
            }).forEach(nestNodes.bind(this));
            return obj;
        }.bind(this), {});
};

/**
 * iterate through path nodes and nest them in map object
 * @param  {String}  nodeName  name of the current node
 * @param  {Integer} i         node names iterator
 */
function nestNodes(nodeName, i) {
    if (this.filePath.length - 1 > i) {
        if (!this.node.hasOwnProperty(nodeName) || !isPlainObject(this.node[nodeName])) {
            this.node[nodeName] = {};
        }
        this.node = this.node[nodeName];
    } else {
        this.node[path.basename(nodeName, path.extname(nodeName))] = require(path.join(this.cwd, this.file));
    }
}

/**
 * test if given object is a plain object
 * @param  {mixed}   obj  object to test
 * @return {Boolean}      result
 */
function isPlainObject(obj) {
    return typeof obj === 'object' && obj.constructor === Object;
}

/**
 * export class
 * @type {RequirementsMapper}
 */
module.exports = RequirementsMapper;
