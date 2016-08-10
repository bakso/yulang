'use strict';

var YuLang = require('./lib/yulang');
var Parser = YuLang.Parser;
var Interpreter = YuLang.Interpreter;
var onChange = YuLang.onChange;

let test = `
let inc = 1
let ret = 0
let true = 1
while true {
  if inc > 100 {
    break
  }
  ret = ret + inc
  inc = inc + 1
}
ret
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
