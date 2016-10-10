# yulang

just a small toy language

-------------------------

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
```
