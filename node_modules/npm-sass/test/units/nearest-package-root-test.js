var nearestPackageRoot = require('../../lib/resolver/nearest-package-root');
var assert = require('assert');
var path = require('path');

var fixturesPath = path.resolve.bind(null,
  __dirname,
  '..',
  'fixtures',
  'nearest-package-root-test'
)

describe('nearestPackageRoot', function () {
  it('finds the nearest module folder based on the import origin', function (done) {
    var sourcePath = fixturesPath('index.scss');
    nearestPackageRoot('test-module', sourcePath).then(function (result) {
      assert.equal(result, fixturesPath('node_modules', 'test-module'));
    })
    .then(done)
    .catch(done);
  });

  it('works with nested dependencies', function (done) {
    var sourcePath = fixturesPath('node_modules', 'test-module', 'index.scss');
    nearestPackageRoot('nested-module', sourcePath).then(function (result) {
      assert.equal(result, fixturesPath('node_modules', 'test-module', 'node_modules', 'nested-module'));
    })
    .then(done)
    .catch(done);
  });
});
