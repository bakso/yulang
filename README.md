# yulang

just a small toy language

-------------------------

# Example

## While

```
let inc = 1
let ret = 0
while true {
  if inc > 100 {
    break
  }
  ret = ret + inc
  inc = inc + 1
}
print(ret) #print 5050
```

## Function

```
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
print(total) #print 5050
```

## Closure

```
func create() {
  let i = 0
  func inc() {
    i = i + 1
    print(i)
  }
  return inc
}
let add = create()
add() #print 1
add() #print 2
add() #print 3
```

## Factorial

```
func factorial(n) {
  if n <= 1 {
    return 1
  }
  return factorial(n - 1) * n
}
print(factorial(5)) #print 120
```

# Usage

## Install

```
$ npm install yulang
```
## API

```javascript
'use strict';

var YuLang = require('./lib/yulang');
var Parser = YuLang.Parser;
var Interpreter = YuLang.Interpreter;

let test = `
print(1) #print 1
`;

var ast = Parser.parse(test);
console.log('AST:')
console.log(JSON.stringify(ast, null, 4));
try {
  var it = new Interpreter(ast);
  it.execute();
}catch(e) {
  console.log(e.stack);
}
```
