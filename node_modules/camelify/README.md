camelify
========

Turns hyphen-separated object keys or strings into camel-cased versions.

Examples
--------

`npm install camelify`

```javascript
camelify('one-two');
// => 'oneTwo'

camelify({
  'first-name': 'John',
  'last-name': 'Smith'
});
// => { firstName: 'John', 'lastName': 'Smith' }
```

Tests
-----

`npm test`