'use strict';

var YuLang = require('./lib/yulang');
var Parser = YuLang.Parser;
var Interpreter = YuLang.Interpreter;
var onChange = YuLang.onChange;

let test = `
let foo = 1
while true {
  if foo > 100 {
    break;
  }
  foo = foo + 1
}
foo;
`;

run();
onChange(run);

function run() {
  var ast = Parser.parse(test);
  console.log('AST:')
  console.log(JSON.stringify(ast, null, 4));
  var it = new Interpreter(ast);
  console.log('Result is:');
  console.log(it.execute());
}
