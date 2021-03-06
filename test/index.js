'use strict';

var assert = require('assert'),
    path = require('path');

var Pkg = require('..');

var pkgJson = require('../package.json');

var pkgName = pkgJson.name;

var expectations = require('./expectations.json');

describe(pkgName, function() {

  it('should return recursively required contents of a directory as object', function() {
    assert.deepEqual(new Pkg('fixtures/basic').map(), expectations.basic);
  });

  it('should accept absolute paths', function() {
    assert.deepEqual(new Pkg(path.join(process.cwd(), 'test/fixtures/basic')).map(), expectations.basic);
  });

  it('should accept a cwd for globbing and require', function() {
    var pkg = new Pkg();
    pkg.cwd = path.join(process.cwd(), 'test/fixtures/basic');
    assert.deepEqual(pkg.map(), expectations.basic);
  });

  it('should overwrite existing properties depending on alphabetic order of found files and directories', function() {
    var pkg = new Pkg('fixtures/overwrite');
    assert.deepEqual(pkg.map(), expectations.overwrite);
  });

  it('should accept custom glob patterns', function() {
    var pkg = new Pkg('fixtures/basic');
    pkg.globPattern = '**/*.js';
    assert.deepEqual(pkg.map(), expectations.simple);
  });

  it('should accept custom glob options', function() {
    var pkg = new Pkg('fixtures/overwrite');
    pkg.globOptions = {ignore: 'foo/**/*.js?(on)'};
    assert.deepEqual(pkg.map(), expectations.simple);
  });

  it('should sanitize file and folder names to camelcase', function() {
    var pkg = new Pkg('fixtures/chars');
    assert.deepEqual(pkg.map(), expectations.chars);
  });

  it('should clear require cache by default', function(cb) {
    var pkg = new Pkg('fixtures/cache'),
        map1 = pkg.map(),
        map2;
    setTimeout(function() {
      map2 = pkg.map();
      assert.equal(typeof map1.microtime, 'number');
      assert.equal(typeof map2.microtime, 'number');
      assert.notEqual(map1.microtime, map2.microtime);
      cb();
    }, 5);
  });

  it('should allow to disable clearing require cache', function(cb) {
    var pkg = new Pkg('fixtures/cache', null, false),
        map1 = pkg.map(),
        map2;
    setTimeout(function() {
      map2 = pkg.map();
      assert.equal(map1.microtime, map2.microtime);
      cb();
    }, 5);
  });

  it('should fallback to process.cwd() when no directory is set', function() {
    var pkg = new Pkg();
    pkg.globPattern = 'test/fixtures/basic/*.js';
    assert.deepEqual(pkg.map(), expectations.fallback);
  });

  it('should be possible to use relative paths when using it as submodule via require.', function() {
    assert.deepEqual(require('./fixtures/module'), expectations.simple);
  });

});
