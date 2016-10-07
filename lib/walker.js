'use strict';

function walk(node, vistors, scope) {
  if (node && node.type) {
    vistors['enter'] && vistors['enter'](node, scope);
    vistors[node.type] && vistors[node.type](node, scope);
    scope = node.scope || scope;
    Object.keys(node).forEach(function (key) {
      let value = node[key];
      if (isArray(value)) {
        let len = value.length;
        for (let i = 0; i < len; i++) {
          walk(value[i], vistors, scope);
        }
      } else {
        walk(value, vistors, scope);
      }
    });

    vistors['leave'] && vistors['leave'](node, scope);
  }
}

const toString = Object.prototype.toString;
function isArray(thing) {
	return toString.call( thing ) === '[object Array]';
}

exports.walk = walk;
