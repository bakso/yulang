'use strict';

var YuLang = require('./lib/yulang');
var Parser = YuLang.Parser;
var Interpreter = YuLang.Interpreter;
var onChange = YuLang.onChange;

let test = `
print(factorial(5))
func factorial(n) {
  if n <= 1 {
    return 1
  }
  return factorial(n - 1) * n
}

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
print(total)
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
