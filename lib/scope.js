'use strict';

class Symbol {
  constructor(config) {
    this.value = config.value;
    this.node = config.node;
    let type = typeof this.value;
    this.type = type === 'object' ? 'ref' : type;
  }
}

class Scope {
  constructor(config) {
    this.name = config.name || 'local';
    this.symbolTable = {};
    this.super = config.super || null;
  }
  define(id, value, node) {
    value = typeof value === 'undefined' ? null : value;
    this.symbolTable[id] = new Symbol({
      value: value,
      node: node
    });
    return value;
  }
  resolve(id) {
    let symbol = this.symbolTable[id];
    if (typeof symbol === 'undefined') {
      if (this.super) {
        return this.super.resolve(id);
      }
      return null;
    }
    return symbol;
  }
  assign(id, value) {
    let symbol = this.resolve(id);
    if (typeof symbol !== 'undefined') {
      return symbol.value = value;
    }
    throw new Error('Assign to an undefined id!');
  }
}

module.exports = Scope;
