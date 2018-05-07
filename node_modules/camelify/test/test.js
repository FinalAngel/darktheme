var camelify = require('../index');

require('chai').should();

describe('camelify', function () {

    it('maps hyphen-separated object keys to camelCase', function () {
        var input = {
            'foo-bar': 1,
            'baz': 2
        };
        camelify(input).should.eql({
            fooBar: 1,
            baz: 2
        });
    });

    it('can handle multiple hyphen separations', function () {
        var input = {
            'foo-bar-baz': 1
        };
        camelify(input).should.eql({
            fooBarBaz: 1
        });
    });

    it('can handle object keys with numbers', function () {
        var input = {
            'address-line-1': 1,
            'address-line-2-1': 2
        };
        camelify(input).should.eql({
            addressLine1: 1,
            addressLine21: 2
        });
    });

    it('returns a camelified string if passed a string', function () {
        camelify('hyphen-separated').should.equal('hyphenSeparated');
    });

    it('throws on non-object input', function () {
        var fn = function () {
            camelify(1);
        };
        fn.should.throw();
    });

});