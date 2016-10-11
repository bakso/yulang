'use strict';

class Symbol {
  constructor(config) {
    this.node = config.node;
    this.scope = config.scope;
    this.setValue(config.value);
  }
  setValue(value) {
    this.value = null;
    if (value === null) {
      this.type = 'ref';
    } else if (value === undefined){
      this.type = 'null';
    } else {
      let type = typeof value;
      if (type === 'object') {
        this.type = 'ref';
      } else {
        this.type = type;
      }
      this.value = value;
    }
  }
}

class Scope {
  constructor(config) {
    this.name = config.name || 'local';
    this.super = config.super || null;
    this.symbolTable = {};
  }
  define(id, value, node) {
    value = typeof value === 'undefined' ? null : value;
    this.symbolTable[id] = new Symbol({
      value: value,
      node: node,
      scope: this
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
      symbol.setValue(value);
      return symbol.value = value;
    }
    throw new Error('Assign to an undefined id!');
  }
}

module.exports = Scope;
