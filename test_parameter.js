'use strict';

var YuLang = require('./lib/yulang');
var Parser = YuLang.Parser;
var Interpreter = YuLang.Interpreter;
var onChange = YuLang.onChange;

let test = `
func foo(a, b) {
  print(a, b)
}
foo(1, 2)
`;

run();
onChange(run);

function run() {
  var ast = Parser.parse(test);
  console.log('AST:')
  console.log(JSON.stringify(ast, null, 4));
  try {
    var it = new Interpreter(ast);
    it.execute();
  }catch(e) {
    console.log(e.stack);
  }
}
