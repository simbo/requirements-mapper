'use strict';

var assert = require('assert'),
    path = require('path');

var pkgJson = require('../package.json'),
    pkgName = pkgJson.name,
    Pkg = require('..');

var expectations = {
        basic: {
            bar: true,
            baz: {
                bada: true,
                bing: true,
                ping: {
                    pong: true
                }
            },
            foo: true
        },
        overwrite: {
            foo: {
                bar: true
            }
        },
        customGlob: {
            foo: true
        },
        fallback: {
            fixtures: {
                basic: {
                    foo: true
                }
            }
        }
    };

describe(pkgName, function() {

    it('should return recursively required contents of a directory as object', function() {
        assert.deepEqual(new Pkg('fixtures/basic').map(), expectations.basic);
    });

    it('should accept absolute paths', function() {
        assert.deepEqual(new Pkg(path.join(process.cwd(), 'test/fixtures/basic')).map(), expectations.basic);
    });

    it('should accept a cwd for globbing and require', function() {
        var p = new Pkg();
        p.cwd = path.join(process.cwd(), 'test/fixtures/basic');
        assert.deepEqual(p.map(), expectations.basic);
    });

    it('should overwrite existing properties depending on alphabetic order of found files and directories', function() {
        assert.deepEqual(new Pkg('fixtures/overwrite').map(), expectations.overwrite);
    });

    it('should accept custom glob patterns', function() {
        var p = new Pkg('fixtures/basic');
        p.globPattern = '**/*.js';
        assert.deepEqual(p.map(), expectations.customGlob);
    });

    it('should accept custom glob options', function() {
        var p = new Pkg('fixtures/overwrite');
        p.globOptions = {ignore: 'foo/**/*.js?(on)'};
        assert.deepEqual(p.map(), expectations.customGlob);
    });

    it('should fallback to \'.\' when no directory is set', function() {
        var p = new Pkg();
        p.globPattern = 'fixtures/basic/*.js';
        assert.deepEqual(p.map(), expectations.fallback);
    });

});
