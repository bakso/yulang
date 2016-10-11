'use strict';
let fs = require('fs');
let path = require('path');
let peg = require('pegjs');
let Interpreter = require('./interpreter');

let pegfile = path.join(__dirname, './yulang.pegjs');
let Parser = peg.buildParser(fs.readFileSync(pegfile, 'utf-8'));

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
