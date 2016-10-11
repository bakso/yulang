# yulang

just a small toy language

-------------------------

# Examples

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

func factorial(n) {
  if n <= 1 {
    return 1
  }
  return factorial(n - 1) * n
}
print(factorial(5)) #print 120
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

### AST

```
AST:
{
    "type": "Program",
    "body": [
        {
            "type": "FunctionDeclarationStatement",
            "id": {
                "type": "Identifier",
                "name": "create"
            },
            "params": null,
            "body": {
                "type": "BlockStatement",
                "body": [
                    {
                        "type": "VariableDeclarator",
                        "id": {
                            "type": "Identifier",
                            "name": "i"
                        },
                        "init": {
                            "type": "Literal",
                            "value": 0,
                            "raw": "0"
                        }
                    },
                    {
                        "type": "FunctionDeclarationStatement",
                        "id": {
                            "type": "Identifier",
                            "name": "inc"
                        },
                        "params": null,
                        "body": {
                            "type": "BlockStatement",
                            "body": [
                                {
                                    "type": "ExpressionStatement",
                                    "expression": {
                                        "type": "AssignmentExpression",
                                        "operator": "=",
                                        "left": {
                                            "type": "Identifier",
                                            "name": "i"
                                        },
                                        "right": {
                                            "type": "BinaryExpression",
                                            "operator": "+",
                                            "left": {
                                                "type": "Identifier",
                                                "name": "i"
                                            },
                                            "right": {
                                                "type": "Literal",
                                                "value": 1,
                                                "raw": "1"
                                            }
                                        }
                                    }
                                },
                                {
                                    "type": "ExpressionStatement",
                                    "expression": {
                                        "type": "CallExpression",
                                        "callee": {
                                            "type": "Identifier",
                                            "name": "print"
                                        },
                                        "arguments": [
                                            {
                                                "type": "Identifier",
                                                "name": "i"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "type": "ReturnStatement",
                        "argument": {
                            "type": "Identifier",
                            "name": "inc"
                        }
                    }
                ]
            }
        },
        {
            "type": "VariableDeclarator",
            "id": {
                "type": "Identifier",
                "name": "add"
            },
            "init": {
                "type": "CallExpression",
                "callee": {
                    "type": "Identifier",
                    "name": "create"
                },
                "arguments": null
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "CallExpression",
                "callee": {
                    "type": "Identifier",
                    "name": "add"
                },
                "arguments": null
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "CallExpression",
                "callee": {
                    "type": "Identifier",
                    "name": "add"
                },
                "arguments": null
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "CallExpression",
                "callee": {
                    "type": "Identifier",
                    "name": "add"
                },
                "arguments": null
            }
        },
        {
            "type": "FunctionDeclarationStatement",
            "id": {
                "type": "Identifier",
                "name": "factorial"
            },
            "params": [
                {
                    "type": "Identifier",
                    "name": "n"
                }
            ],
            "body": {
                "type": "BlockStatement",
                "body": [
                    {
                        "type": "IFStatement",
                        "test": {
                            "type": "BinaryExpression",
                            "operator": "<=",
                            "left": {
                                "type": "Identifier",
                                "name": "n"
                            },
                            "right": {
                                "type": "Literal",
                                "value": 1,
                                "raw": "1"
                            }
                        },
                        "consequent": {
                            "type": "BlockStatement",
                            "body": [
                                {
                                    "type": "ReturnStatement",
                                    "argument": {
                                        "type": "Literal",
                                        "value": 1,
                                        "raw": "1"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "type": "ReturnStatement",
                        "argument": {
                            "type": "BinaryExpression",
                            "operator": "*",
                            "left": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "Identifier",
                                    "name": "factorial"
                                },
                                "arguments": [
                                    {
                                        "type": "BinaryExpression",
                                        "operator": "-",
                                        "left": {
                                            "type": "Identifier",
                                            "name": "n"
                                        },
                                        "right": {
                                            "type": "Literal",
                                            "value": 1,
                                            "raw": "1"
                                        }
                                    }
                                ]
                            },
                            "right": {
                                "type": "Identifier",
                                "name": "n"
                            }
                        }
                    }
                ]
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "CallExpression",
                "callee": {
                    "type": "Identifier",
                    "name": "print"
                },
                "arguments": [
                    {
                        "type": "CallExpression",
                        "callee": {
                            "type": "Identifier",
                            "name": "factorial"
                        },
                        "arguments": [
                            {
                                "type": "Literal",
                                "value": 5,
                                "raw": "5"
                            }
                        ]
                    }
                ]
            }
        }
    ]
}
```

### Result

Result is:

```
1
2
3
120
```
