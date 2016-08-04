# yulang

just a small toy language

## Syntax

```
let foo = 1
while true {
  if foo > 10 {
    break;
  }
  foo = foo + 1
}
```

## AST

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
