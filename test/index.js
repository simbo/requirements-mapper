'use strict';

var assert = require('assert'),
    path = require('path');

var pgkJson = require('../package.json'),
    pkgName = pgkJson.name,
    pkg = require('..');

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
        }
    };

describe(pkgName, function() {

    it('should return recursively required contents of a directory as object', function() {
        assert.deepEqual(new pkg('fixtures/basic').map(), expectations.basic);
    });

    it('should overwrite the required contents of a file if there is a directory with the same name on the same level', function() {
        assert.deepEqual(new pkg('fixtures/overwrite').map(), expectations.overwrite);
    });

    it('should accept absolute paths', function() {
        assert.deepEqual(new pkg(path.join(process.cwd(), 'test/fixtures/basic')).map(), expectations.basic);
    });

});
