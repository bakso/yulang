'use strict';

var fs = require('fs');
var peg = require('pegjs');

var file = './yulang.pegjs';
var parser = peg.buildParser(fs.readFileSync(file, 'utf-8'));
fs.watch(file, function (ev) {
  console.log("yulang.pegjs changed!");
  try {
    parser = peg.buildParser(fs.readFileSync(file, 'utf-8'));
    parse();
  }catch(e){
    console.log(e.stack);
  }
});
let test = `
let foo = 1
while true {
  if foo > 10 {
    break;
  }
  foo = foo + 1
}
`;
parse();
function parse() {
  console.log(JSON.stringify(parser.parse(test), null, 4));
}
