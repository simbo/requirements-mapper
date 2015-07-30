'use strict';

var path = require('path'),
    glob = require('glob');

function RequirementsMapper (dir, globPattern) {
    this.dir = dir || '.';
    this.globPattern = globPattern || '**/*.js?(on)';
    this.cwd = path.isAbsolute(this.dir) ? this.dir : path.join(path.dirname(module.parent.filename), this.dir);
}

RequirementsMapper.prototype.map = function () {
    return glob.sync(this.globPattern, { cwd: this.cwd }).reduce(function (obj, file) {
        this.node = obj;
        this.file = file;
        this.filePath = path.normalize(file).split(path.sep);
        this.filePath.filter(function (node) {
            return !!node;
        }).forEach(nestNodes.bind(this));
        return obj;
    }.bind(this), {});
};

function nestNodes (nodeName, i) {
    if (this.filePath.length-1 > i) {
        if (!this.node.hasOwnProperty(nodeName) || !isPlainObject(this.node[nodeName])) {
            this.node[nodeName] = {};
        }
        this.node = this.node[nodeName];
    }
    else {
        this.node[path.basename(nodeName, path.extname(nodeName))] = require(path.join(this.cwd, this.file));
    }
}

function isPlainObject (obj) {
    return typeof obj === 'object' && obj.constructor === Object;
}

module.exports = RequirementsMapper;
