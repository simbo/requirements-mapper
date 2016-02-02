'use strict';

var path = require('path');

var glob = require('glob'),
    camelCase = require('camelcase');

/**
 * RequirementsMapper constructor
 *
 * @param {String}       dir          directory to map
 * @param {String|Array} globPattern  glob pattern(s)
 */
function RequirementsMapper(dir, globPattern, clearCache) {
  this.dir = dir || process.cwd();
  this.globPattern = globPattern || '**/*.js?(on)';
  this.cwd = path.isAbsolute(this.dir) ? this.dir : path.join(path.dirname(module.parent.filename), this.dir);
  this.globOptions = {};
  this.clearCache = clearCache === undefined || clearCache === true;
}


/**
 * create requirements object
 *
 * @return {Object}  plain object containing required matches
 */
RequirementsMapper.prototype.map = function() {
  this.globOptions.cwd = this.cwd;
  return glob.sync(this.globPattern, this.globOptions).reduce(function(obj, file) {
    this.node = obj;
    this.file = file;
    this.filePath = path.normalize(file).split(path.sep);
    this.filePath.filter(function(node) {
      return Boolean(node);
    }).forEach(nestNodes.bind(this));
    return obj;
  }.bind(this), {});
};


/**
 * iterate through path nodes and nest them in map object
 *
 * @param  {String}  nodeName  name of the current node
 * @param  {Integer} i         node names iterator
 */
function nestNodes(nodeName, i) {
  var requirePath;
  nodeName = sanitizeNodeName(nodeName);
  if (this.filePath.length - 1 > i) {
    if (!this.node.hasOwnProperty(nodeName) || !isPlainObject(this.node[nodeName])) {
      this.node[nodeName] = {};
    }
    this.node = this.node[nodeName];
  } else {
    requirePath = path.join(this.cwd, this.file);
    if (this.clearCache) {
      delete require.cache[require.resolve(requirePath)];
    }
    this.node[nodeName] = require(requirePath);
  }
}


/**
 * return sanitized node name
 * @param  {String} nodeName file path
 * @return {String}          node name
 */
function sanitizeNodeName(nodeName) {
  nodeName = path.basename(String(nodeName), path.extname(nodeName));
  return camelCase(nodeName.replace(/[^a-z0-9 _-]/ig, ''));
}


/**
 * test if given object is a plain object
 *
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

// necessary to get the current `module.parent` and resolve paths correctly
delete require.cache[__filename];
