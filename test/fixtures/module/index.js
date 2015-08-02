'use strict';

var Pkg = require('../../..');

module.exports = (function() {
    var p = new Pkg('./data');
    return p.map();
}());
