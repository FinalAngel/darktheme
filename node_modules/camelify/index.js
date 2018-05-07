function camelifyString(str) {
  return str.replace(/\-([a-z0-9]{1})/g, function (a, s) { return s.toUpperCase(); }, 'g');
}

module.exports = function camelify(obj) {
  if (typeof obj === 'string') {
    return camelifyString(obj);
  }
  if (typeof obj !== 'object') {
    throw new TypeError('argument must be an object');
  }
  var output = {};
  for (var i in obj) {
    if (typeof i === 'string') {
      output[camelifyString(i)] = obj[i];
    } else {
      output[i] = obj[i];
    }
  }
  return output;
};