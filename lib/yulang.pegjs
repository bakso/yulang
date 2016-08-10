{
  function buildBinaryExpression(op, left, right) {
    return {
      type: 'BinaryExpression',
      operator: op,
      left: left,
      right: right
    }
  }
}

Start
  = __ program:Program {
    return program
  }

Program
  = statementList:StatementList {
    return {
      type: 'Program',
      body: statementList
    }
  }

StatementList
  = statements:Statement* {
    return statements;
  }

Statement
  = IFStatement
  / WhileStatement
  / DeclareStatement
  / ExpressionStatement
  / BreakStatement

DeclareStatement
  = __ LetToken _ id:Identifier _ "=" e:Expression __ {
    return {
      type: 'VariableDeclarator',
      id: id,
      init: e
    }
  }

ExpressionStatement
  = __ e:Expression EOS {
    return {
      type: 'ExpressionStatement',
      expression: e
    }
  }

IFStatement
  = __ IfToken _ test:Expression _ consequent:BlockExpression {
    return {
      type: 'IFStatement',
      test: test,
      consequent: consequent
    }
  }

WhileStatement
  = __ WhileToken _ condition:Expression _ body:BlockExpression {
    return {
      type: 'WhileStatement',
      condition: condition,
      body: body
    }
  }

BlockExpression = LR __ statementList:StatementList __ RR EOS {
  return {
    type: 'BlockStatement',
    body: statementList
  }
}

BreakStatement
  = __ BreakToken EOS{
    return {
      "type": "BreakStatement"
    }
  }

PrimaryExpression
  = Identifier
  / Literal
  / "(" __ expression:Expression __ ")" {
    return expression;
  }

Expression
  = AssignmentExpression

AssignmentExpression
  = !LetToken head:(__ id:Identifier _ op:AssignmentOperator{
    return {
      id: id,
      operator: op
    }
  })? _ e:RelationalExpression {
    if (head) {
      return {
        type: 'AssignmentExpression',
        operator: head.operator,
        left: head.id,
        right: e
      }
    }
    return e;
  }

RelationalExpression
  = head: AdditiveExpression tail:(_ op:RelationalOperator _ right:AdditiveExpression{
    return {
      operator: op,
      right: right
    }
  })? {
    if (tail) {
      return buildBinaryExpression(tail.operator, head, tail.right)
    }
    return head
  }

AdditiveExpression
  = head:PrimaryExpression tail:(_ op:("+"/"-") _ right:PrimaryExpression {
    return {
      operator: op,
      right: right
    }
  })? {
    if (tail) {
      return buildBinaryExpression(tail.operator, head, tail.right)
    }
    return head
  }

Literal
  = Number
  / Boolean

Number
  = [-+]?[0-9]+("."[0-9]+)? {
    var raw = text();
    return {
      type: 'Literal',
      value: parseFloat(raw),
      raw: raw
    }
  }

Boolean
  = BooleanRaw {
    var raw = text();
    var value = raw === "true" ? true : false;
    return {
      type: 'Literal',
      value: value,
      raw: raw
    }
  }

BooleanRaw
  = "true" !Identifier
  / "false" !Identifier

Identifier
  = _ !ReservedWord head:[a-zA-z_] tails:[a-zA-z0-9_]* _ {
    var ret = [head];
    tails.forEach(function (item) {
      ret.push(item);
    });
    return {
      type: "Identifier",
      name: ret.join('')
    }
  }

ReservedWord
  = Boolean
  / BreakToken

AssignmentOperator
  = "="

RelationalOperator
  = "<="
  / ">="
  / "<"
  / ">"
  / "=="

/* tokens */
IfToken = "if"
WhileToken = "while"
LetToken = "let"
BreakToken = "break"
PRINT = "print"

LR = "{"
RR = "}"

semicolon "semicolon"
  = ";"

ws "white space"
  = " "
  / "\t"

LineTerminator "line terminator"
  = "\n"
  / "\r\n"
_
  = ws*
__
  = (ws / LineTerminator)*

EOS "end of statement"
  = _ LineTerminator
  / __ EOF

EOF "end of file"
  = !.
