var Import = require('../../lib/resolver/import');
var assert = require('assert');

describe('Import', function () {
  describe('#isScoped', function () {
    it('returns true if package is scoped', function () {
      var subject1 = new Import('@scoped/package');
      var subject2 = new Import('non-scoped-package');

      assert(subject1.isScoped());
      assert(!subject2.isScoped());
    });
  });

  describe('#packageName', function () {
    it('returns the assumed package name', function () {
      var subject1 = new Import('@scoped/package/nested-path');
      var subject2 = new Import('non-scoped-package/nested-path');

      assert.equal(subject1.packageName(), '@scoped/package');
      assert.equal(subject2.packageName(), 'non-scoped-package');
    });
  });

  describe('#isEntrypoint', function () {
    it('returns true if the import is for the entrypoint', function () {
      var subject1 = new Import('@scoped/package/nested-path');
      var subject2 = new Import('@scoped/package');
      var subject3 = new Import('non-scoped-package/nested-path');
      var subject4 = new Import('non-scoped-package');

      assert(!subject1.isEntrypoint());
      assert(subject2.isEntrypoint());
      assert(!subject3.isEntrypoint());
      assert(subject4.isEntrypoint());
    });
  });

  describe('#specifiedFilePath', function () {
    it('returns the specified nested path', function () {
      var subject = new Import('@scoped/package/nested-path1/nested-path2');

      assert.equal(subject.specifiedFilePath(), '/nested-path1/nested-path2');
    });
  });
});
