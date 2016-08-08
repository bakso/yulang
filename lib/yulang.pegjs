{
  function buildBinaryExpress(op, left, right) {
    return {
      type: 'BinaryExpression',
      operator: op,
      left: left,
      right: right
    }
  }
}

Start
  = __ program:Program __ {
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
  = __ LET _ id:Identifier _ "=" _ e:Expression _ ";"* __ {
    return {
      type: 'VariableDeclarator',
      id: id,
      init: e
    }
  }

ExpressionStatement
  = __ e:Expression __ {
    return {
      type: 'ExpressionStatement',
      expression: e
    }
  }

IFStatement
  = __ IF _ test:Expression _ consequent:BlockExpression __ {
    return {
      type: 'IFStatement',
      test: test,
      consequent: consequent
    }
  }

WhileStatement
  = __ WHILE _ condition:Expression _ body:BlockExpression __ {
    return {
      type: 'WhileStatement',
      condition: condition,
      body: body
    }
  }

BreakStatement
  = __ BREAK _ ";"* __{
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
  = head:(__ id:Identifier _ op:Operator{
    return {
      id: id,
      operator: op
    }
  })? _ e:RelationalExpression _ ";"* __ {
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
  = __ head: AdditiveExpression tail:(_ op:RelationalOperator _ right:AdditiveExpression{
    return {
      operator: op,
      right: right
    }
  })? __ {
    if (tail) {
      return buildBinaryExpress(tail.operator, head, tail.right)
    }
    return head
  }

RelationalOperator
  = "<="
  / ">="
  / "<"
  / ">"
  / "=="

AdditiveExpression
  = __ head:PrimaryExpression tail:(_ op:("+"/"-") _ right:PrimaryExpression {
    return {
      operator: op,
      right: right
    }
  })? __ {
    if (tail) {
      return buildBinaryExpress(tail.operator, head, tail.right)
    }
    return head
  }

BlockExpression = __ LR _ statementList:StatementList _ RR __ {
  return {
    type: 'BlockStatement',
    body: statementList
  }
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
  / BreakStatement

Operator
  = "="

IF = "if"
WHILE = "while"
LET = "let"
BREAK = "break"
PRINT = "print"

LR = "{"
RR = "}"

_ "space"
  = [ \t]*
__ "space or break line"
  = [ \t\n\r]*
_break_ "break line"
  = breakline*
breakline "break line simbol"
  = "\n"
  / "\r\n"
