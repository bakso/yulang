'use strict';
var fs = require('fs');
var path = require('path');
var peg = require('pegjs');
var Interpreter = require('./interpreter');

var pegfile = path.join(__dirname, './yulang.pegjs');
var Parser = peg.buildParser(fs.readFileSync(pegfile, 'utf-8'));

module.exports = {
  Parser,
  Interpreter,
  onChange: function (fn) {
    fs.watch(pegfile, function (ev) {
      console.log("yulang.pegjs changed!");
      try {
        Parser = peg.buildParser(fs.readFileSync(pegfile, 'utf-8'));
        fn();
      }catch(e){
        console.log(e.stack);
      }
    });
  }
}
