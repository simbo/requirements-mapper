requirements-mapper
===================

  > Auto-require all matching files within a directory recursively and return
  > them as single object, representing the directory's structure.

[![npm Package Version](https://img.shields.io/npm/v/requirements-mapper.svg?style=flat-square)](https://www.npmjs.com/package/requirements-mapper)
[![MIT License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://simbo.mit-license.org)
[![Travis Build Status](https://img.shields.io/travis/simbo/requirements-mapper/master.svg?style=flat-square)](https://travis-ci.org/simbo/requirements-mapper)
[![Code Climate GPA](https://img.shields.io/codeclimate/github/simbo/requirements-mapper.svg?style=flat-square)](https://codeclimate.com/github/simbo/requirements-mapper)
[![Code Climate Test Coverage](https://img.shields.io/codeclimate/coverage/github/simbo/requirements-mapper.svg?style=flat-square)](https://codeclimate.com/github/simbo/requirements-mapper)

[![Dependencies Status](https://img.shields.io/david/simbo/requirements-mapper.svg?style=flat-square)](https://david-dm.org/simbo/requirements-mapper)
[![devDependencies Status](https://img.shields.io/david/dev/simbo/requirements-mapper.svg?style=flat-square)](https://david-dm.org/simbo/requirements-mapper#info=devDependencies)

---

## Usage

``` javascript
var ReqMapper = require('requirements-mapper'),
    dataMapper = new ReqMapper('./data')),
    dataMap = dataMapper.map();
```


### Example

Assuming that `./data` is a directory containing multiple files using subfolders
like this:

``` text
data/
 ├─╸ other/
 │    ├─╸ bar.js
 │    └─╸ baz.json
 └─╸ foo.js
```

An object of which every node contains the `require`d contents of the respective
file will be returned by `RequirementsMapper.map()`:

``` javascript
{
    other: {
        bar: …
        baz: …
    },
    foo: …
}
```


### Options

The constructor of `RequirementsMapper` accepts 3 parameters:

  - `dir` - directory to scan; defaults to `process.cwd()`
  - `globPattern` - globbing pattern for finding files; defaults to
    `**/*.js?(on)`
  - `clearCache` - clear the require cache for a node, before requiring it; defaults to `true`

See [node-glob](https://github.com/isaacs/node-glob) for more details on 
globbing options.


## License

[MIT Simon Lepel 2015](http://simbo.mit-license.org)
