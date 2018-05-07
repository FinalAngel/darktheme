var inspect = require('util').inspect;
var xmlparse = require('xml-parser');
var _ = require('lodash');


function logObj(obj) {
  console.log(inspect(obj, { colors: true, depth: Infinity }));
}

function getNodes(obj, keyValue, firstMatch, depth) {
  firstMatch = (typeof firstMatch !== 'undefined') ? firstMatch : true;
  depth = (typeof depth !== 'undefined') ? depth : Infinity;
  var matches = [];
  var match = null;

  if (keyValue.value === undefined) {
    if (keyValue.key.indexOf('@') === 0 && _.has(obj.attributes, keyValue.key.slice(1))) {
      // match = obj.attributes[keyValue.key.slice(1)];
      match = new Node(obj, keyValue.key.slice(1));
      // console.log(match);
    } else if (obj[keyValue.key] || _.has(obj, keyValue.key)) {
      match = obj;
    }
  } else if (_.isObject(keyValue.value)) {
    if (_.findKey(obj, keyValue.value) === keyValue.key) {
      match = obj;
    }
  } else if (obj[keyValue.key] === keyValue.value) {
    match = obj;
  } else if (keyValue.key === 'attributes' && (typeof keyValue.value === 'string') && _.has(obj.attributes, keyValue.value)) {
    match = obj;
  }

  if (match) {
    if (!(match instanceof Node)) {
      match = new Node(match);
    }
    matches.push(match);
    if (firstMatch) {
      return matches;
    }
  }

  if (obj.children && depth > 0) {
    if (depth !== Infinity) {
      depth = depth - 1;
    }
    _.forEach(obj.children, function(child) {
      var nodes = getNodes(child, keyValue, firstMatch, depth);
      if (nodes.length) {
        matches = matches.concat(nodes);
        if (firstMatch) {
          return false;
        }
      }
    });
  }

  return matches;
}


function setAttribute(node, attr) {
  return _.assign(node, attr);
}

function getAttribute(node, attr) {
  return node && node.hasOwnProperty(attr) ? node[attr] : null;
}


var Node = function(value, selector) {
  this._value = value;
  this._selector = selector;
}

Node.prototype = {

  attr: function() {
    switch (arguments.length) {
      case 0:
        return this._value.attributes;
        break;
      case 1:
        if (typeof arguments[0] === 'string') {
          return getAttribute(this._value.attributes, arguments[0]);
        }
        return setAttribute(this._value.attributes, arguments[0]);
        break;
      case 2:
        var obj = {};
        obj[arguments[0]] = arguments[1];
        return setAttribute(this._value.attributes, obj);
        break;
    }
  },


  text: function(str) {
    if (this._selector) {
      return null;
    }
    if (!obj) {
      return this._value.content;
    }
    if (!this._value.content) {
      this._value.content = '';
    }
    return setAttribute(this._value.content, str);
  },

  value: function(value) {
    if (!value) {
      return this._selector ? this._value.attributes[this._selector] : this._value;
    }
    this._selector ? (this._value.attributes[this._selector] = value) : (this._value = value);
    return this;
  },


  childNodes:function(){
    return this._value.children;
  }

};


var XMLObject = function(svg) {
  this._obj = xmlparse(svg);
  this._rootNode = null;
}


XMLObject.prototype = {

  attrToString: function(attr) {
    var str = '';
    if (attr) {
      Object.keys(attr).forEach(function(key) {
        str += (' ' + key + '="' + attr[key] + '"');
      });
    }
    return str;
  },

  log: function() {
    logObj(this._obj);
  },

  root: function() {
    if (!this._rootNode) {
      this._rootNode = new Node(this._obj.root);
    }
    return this._rootNode;
  },

  find: function() {
    var self = this;
    var result;
    var all;
    var depth;
    var result = [];
    var fromNode = this._obj.root;

    _.each(arguments, function(query) {

      if (typeof query === 'string') {
        if (query.indexOf('//') === 0) {
          query = query.slice(2);
        } else if (query.indexOf('/') === 0) {
          depth = 1;
          query = query.slice(1);
        }

        //TODO parse strings like xpath || libxml
        // if (query.indexOf('*') === 0) {
        //   query = query.slice(1);
        // }

        // if (query.indexOf('[') === 0) {
        //   query = query.slice(1).slpit(']')[0];
        //   query = { attributes: query };
        // }
      }


      result = result.concat(self.findAllNodes(query, depth));


    });

    return result;
  },

  findNode: function(keyValue, all, depth) {

    if (_.isObject(keyValue)) {
      keyValue = {
        key: _.keys(keyValue)[0],
        value: _.values(keyValue)[0]
      };
    } else if (typeof keyValue === 'string') {
      keyValue = {
        key: keyValue
      };
    }
    var result = [];

    if (keyValue.key === 'name' && keyValue.value === 'root') {
      result = [this._obj.root];
    } else {
      result = getNodes(this._obj.root, keyValue, !all, depth);
    }

    return !all ? result[0] : result;
  },

  findAllNodes: function(keyValue, depth) {
    return this.findNode(keyValue, true, depth);
  },


  toXMLString: function(obj) {

    var self = this;
    var str = '';

    if (!obj) {
      return str;
    }

    var tagName = '';

    Object.keys(obj).some(function(key) {
      var value = obj[key];
      switch (key) {
        case 'root':
        case 'attributes':
          break;

        case 'declaration':
          if ((typeof value !== 'undefined')) {
            var attributes = Object.assign({}, { version: '1.0', encoding: 'utf-8' }, value.attributes);
            str = '<?xml' + self.attrToString(attributes) + '?>';
          }
          break;

        case 'name':
          tagName = value;
          str += '<' + tagName + '' + self.attrToString(obj.attributes) + '>';
          break;

        case 'content':
          str += value;
          break;

        case 'children':
          if (value && value.length) {
            for (var i = 0; i < value.length; i++) {
              str += self.toXMLString(value[i]);
            }
          }
          break;
      }

    });

    if (str.length && tagName) {
      str += '</' + tagName + '>';
    }

    return str;
  },

  toString: function() {
    return this.toXMLString(this._obj.root);
  }

};

module.exports = XMLObject;
