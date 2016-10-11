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
  = head:Statement tails:(NotFirstStatment)* {
    return [head].concat(tails);
  }

Statement
  = IFStatement
  / WhileStatement
  / DeclareStatement
  / ExpressionStatement
  / ReturnStatement
  / BreakStatement
  / FunctionDeclarationStatement

NotFirstStatment
  = EOS __ statement:Statement {
    return statement
  }

FunctionDeclarationStatement
  = FunctionToken _ id: Identifier _ "(" _ params:(ParameterList)? _ ")" _
    body: BlockExpression {
      return {
        type: 'FunctionDeclarationStatement',
        id: {
          type: id.type,
          name: id.name
        },
        params: params,
        body: body
      }
    }

ParameterList
  = head:Identifier tails:NotFirstParameter* {
    return [head].concat(tails)
  }

NotFirstParameter
  = __ "," __ i:Identifier {
    return i
  }

ArgumentsList
  = head:Argument tails:NotFirstArgument* {
    return [head].concat(tails)
  }

NotFirstArgument
  = __ "," __ a:Argument {
    return a
  }

Argument
  = Expression

CallExpression
  = id:Identifier _ "(" _ args:(ArgumentsList)?  _ ")" {
    return {
      type: 'CallExpression',
      callee: id,
      arguments:args
    }
  }

DeclareStatement
  = LetToken _ id:Identifier _ "=" e:Expression {
    return {
      type: 'VariableDeclarator',
      id: id,
      init: e
    }
  }

ExpressionStatement
  = e:Expression {
    return {
      type: 'ExpressionStatement',
      expression: e
    }
  }

IFStatement
  = IfToken _ test:Expression _ consequent:BlockExpression {
    return {
      type: 'IFStatement',
      test: test,
      consequent: consequent
    }
  }

WhileStatement
  = WhileToken _ condition:Expression _ body:BlockExpression {
    return {
      type: 'WhileStatement',
      condition: condition,
      body: body
    }
  }

BlockExpression = LR __ statementList:StatementList? __ RR {
  return {
    type: 'BlockStatement',
    body: statementList
  }
}

BreakStatement
  = BreakToken {
    return {
      "type": "BreakStatement"
    }
  }

ReturnStatement
  = ReturnToken _ e:Expression {
    return {
      "type": "ReturnStatement",
      "argument": e
    }
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
  = head:MultiplicativeExpression tail:(_ op:("+"/"-") _ right:MultiplicativeExpression {
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

MultiplicativeExpression
  = head:PrimaryExpression tail:(_ op:("*"/"/") _ right:PrimaryExpression {
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

PrimaryExpression
  = e:CallExpression {
    return e;
  }
  / Identifier
  / Literal
  / "(" __ expression:Expression __ ")" {
    return expression;
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
  = !ReservedWord head:[a-zA-z_] tails:[a-zA-z0-9_]* _ {
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
  / FunctionToken
  / IfToken
  / WhileToken
  / LetToken
  / ReturnToken

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
FunctionToken = "func"
ReturnToken = "return"

LR = "{"
RR = "}"

Comment
  = SingleLineComment

SingleLineComment
  = "#" (!LineTerminator SourceCharacter)*

MultiLineComment
  = "/#" (!"#/" SourceCharacter)* "#/"

SourceCharacter
  = .

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
  = (ws / LineTerminator / Comment)*

EOS "end of statement"
  = _ SingleLineComment? LineTerminator
  / __ EOF

EOF "end of file"
  = !.
