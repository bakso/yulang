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
            "type": "VariableDeclarator",
            "id": {
                "type": "Identifier",
                "name": "inc"
            },
            "init": {
                "type": "Literal",
                "value": 1,
                "raw": "1"
            }
        },
        {
            "type": "VariableDeclarator",
            "id": {
                "type": "Identifier",
                "name": "ret"
            },
            "init": {
                "type": "Literal",
                "value": 0,
                "raw": "0"
            }
        },
        {
            "type": "WhileStatement",
            "condition": {
                "type": "Literal",
                "value": true,
                "raw": "true"
            },
            "body": {
                "type": "BlockStatement",
                "body": [
                    {
                        "type": "IFStatement",
                        "test": {
                            "type": "BinaryExpression",
                            "operator": ">",
                            "left": {
                                "type": "Identifier",
                                "name": "inc"
                            },
                            "right": {
                                "type": "Literal",
                                "value": 100,
                                "raw": "100"
                            }
                        },
                        "consequent": {
                            "type": "BlockStatement",
                            "body": [
                                {
                                    "type": "BreakStatement"
                                }
                            ]
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "AssignmentExpression",
                            "operator": "=",
                            "left": {
                                "type": "Identifier",
                                "name": "ret"
                            },
                            "right": {
                                "type": "BinaryExpression",
                                "operator": "+",
                                "left": {
                                    "type": "Identifier",
                                    "name": "ret"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "inc"
                                }
                            }
                        }
                    },
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "AssignmentExpression",
                            "operator": "=",
                            "left": {
                                "type": "Identifier",
                                "name": "inc"
                            },
                            "right": {
                                "type": "BinaryExpression",
                                "operator": "+",
                                "left": {
                                    "type": "Identifier",
                                    "name": "inc"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 1,
                                    "raw": "1"
                                }
                            }
                        }
                    }
                ]
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "Identifier",
                "name": "ret"
            }
        }
    ]
}
```

### Result

```
Result is:
5050
```
