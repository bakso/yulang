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
var onChange = YuLang.onChange;

let test = `
let inc = 1
let ret = 0
while true {
  if inc > 100 {
    break
  }
  ret = ret + inc
  inc = inc + 1
}
ret
`;

var ast = Parser.parse(test);
console.log('AST:')
console.log(JSON.stringify(ast, null, 4));
var it = new Interpreter(ast);
console.log('Result is:');
console.log(it.execute());
```

### ast

```
{
    "type": "Program",
    "body": [
        {
            "type": "VariableDeclarator",
            "id": {
                "type": "Identifier",
                "name": "foo"
            },
            "init": {
                "type": "Literal",
                "value": 1,
                "raw": "1"
            }
        },
        {
            "type": "WhileStatement",
            "condition": {
                "type": "Identifier",
                "name": "true"
            },
            "body": {
                "type": "BlockStatement",
                "body": [
                    {
                        "type": "IFStatement",
                        "test": {
                            "type": "AssignmentExpression",
                            "operator": ">",
                            "left": {
                                "type": "Identifier",
                                "name": "foo"
                            },
                            "right": {
                                "type": "Literal",
                                "value": 10,
                                "raw": "10"
                            }
                        },
                        "consequent": {
                            "type": "BlockStatement",
                            "body": [
                                {
                                    "type": "ExpressionStatement",
                                    "expression": {
                                        "type": "Identifier",
                                        "name": "break"
                                    }
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
                                "name": "foo"
                            },
                            "right": {
                                "type": "BinaryExpression",
                                "operator": "+",
                                "left": {
                                    "type": "Identifier",
                                    "name": "foo"
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
        }
    ]
}
```

### Result

```
Result is:
101
```
