var assert = require('assert');
var path = require('path');

var resolve = require('../../lib/resolver');

var fixturePath = path.resolve.bind(
  null,
  __dirname,
  '..',
  'fixtures',
  /* Re-use package-test fixutres */
  'package-test'
);

describe('resolver', function () {
  describe('entrypoint import', function () {
    it('resolves the entrypoint path', function (done) {
      resolve('test-package', fixturePath('index.scss')).then(function (result) {
        assert.equal(result, fixturePath('node_modules', 'test-package', 'test-package-entrypoint.scss'));
      })
      .then(done)
      .catch(done);
    });
  });

  describe('non entrypoint import', function () {
    it('resolves the correct path', function (done) {
      var importPath = path.join('test-package', 'specific-file-in-package');
      resolve(importPath, fixturePath('index.scss')).then(function (result) {
        assert.equal(result, fixturePath('node_modules', 'test-package', 'specific-file-in-package'));
      })
      .then(done)
      .catch(done);
    });
  });
});
