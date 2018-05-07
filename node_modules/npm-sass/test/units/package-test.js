var assert = require('assert');
var path = require('path');

var Package = require('../../lib/resolver/package');

describe('Package', function () {
  describe('#fullPathToEntrypoint', function () {
    var fixturePath = path.resolve.bind(
      null,
      __dirname,
      '..',
      'fixtures',
      'package-test'
    );

    it('returns the full path to the entrypoint file', function () {
      var subject = new Package(fixturePath('node_modules', 'test-package'));
      var result = subject.fullPathToEntrypoint();

      /* entrypoint file comes from test-package/package.json */
      assert.equal(result, fixturePath('node_modules', 'test-package', 'test-package-entrypoint.scss'))
    });
  });

  describe('#entrypoint', function () {
    /* Borrow function to test all entrypoint scenarios without needing to require a package json file */
    var entrypoint = Package.prototype.entrypoint;

    describe('sass', function () {
      it('returns the entrypoint file', function () {
        var subject = { JSON: { sass: 'package-entrypoint' } }

        var result = entrypoint.call(subject);

        assert.equal(result, 'package-entrypoint');
      });
    });

    describe('style', function () {
      it('returns the entrypoint file', function () {
        var subject = { JSON: { sass: null, style: 'package-entrypoint' } };

        var result = entrypoint.call(subject);

        assert.equal(result, 'package-entrypoint');
      });
    });

    describe('main', function () {
      it('works with scss', function () {
        var subject = {
            JSON: {
                sass: null,
                style: null,
                main: 'index.scss'
            }
        };

        var result = entrypoint.call(subject);

        assert.equal(result, 'index.scss');
      });

      it('works with css', function () {
        var subject = {
            JSON: {
                sass: null,
                style: null,
                main: 'index.css'
            }
        };

        var result = entrypoint.call(subject);

        assert.equal(result, 'index.css');
      });

      it('works with sass', function () {
        var subject = {
            JSON: {
                sass: null,
                style: null,
                main: 'index.sass'
            }
        };

        var result = entrypoint.call(subject);

        assert.equal(result, 'index.sass');
      });
    });

    describe('not specified', function () {
      it('falls back to styles', function () {
        var subject = {
            JSON: {
                sass: null,
                style: null,
                main: null
            }
        };

        var result = entrypoint.call(subject);

        assert.equal(result, 'styles');
      });
    });
  });
});
