'use strict';

var YuLang = require('./lib/yulang');
var Parser = YuLang.Parser;
var Interpreter = YuLang.Interpreter;
var onChange = YuLang.onChange;

let test = `
let i = 1
let end = 100
let total = 0
func add() {
  if i <= end {
    total = total + i
    i = i+1
    add()
  }
}
add()
total
`;

run();
onChange(run);

function run() {
  var ast = Parser.parse(test);
  console.log('AST:')
  console.log(JSON.stringify(ast, null, 4));
  try {
    var it = new Interpreter(ast);
    console.log('Result is:');
    console.log(it.execute());
  }catch(e) {
    console.log(e.stack);
  }
}
