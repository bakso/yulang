'use strict';

const RETURN_STATEMENT_RESULT = 1;
const BREAK_STATEMENT_RESULT = 2;
const CONTINUE_STATEMENT_RESULT = 3;

class Interpreter {
  constructor(ast) {
    this.ast = ast;
    this.globalVars = {};
  }

  executeExpressionList() {

  }

  executeVariableDeclarator(statement) {
    this.globalVars[statement.id.name] = {};
    if (statement.init) {
      this.globalVars[statement.id.name].value = statement.init.value;
    }
  }

  executeWhileStatement(statement) {
    while (true) {
      var conditionResult = this.evalExpression(statement.condition);
      if (conditionResult === false || typeof conditionResult !== 'boolean') {
        break;
      }
      var result;
      try {
        result = this.executeBlockStatement(statement.body);
      }catch(r){
        result = r;
      }
      if (result && result.type === BREAK_STATEMENT_RESULT) {
        break;
      }
    }
  }

  executeExpressionStatement(statement) {
    return this.evalExpression(statement.expression);
  }

  executeIFStatement(statement) {
    var testResult = this.evalBinaryExpression(statement.test);
    if (testResult) {
      this.executeBlockStatement(statement.consequent)
    }
  }

  executeBlockStatement(statement) {
    return this.executeStatementList(statement.body);
  }

  executeBreakStatement(statement) {
    throw {
      type: BREAK_STATEMENT_RESULT
    }
  }

  executeStatementList(statmentList) {
    var result;
    for (var i = 0, len = statmentList.length; i < len; i++) {
      var statement = statmentList[i];
      result = this['execute'+statement.type](statement);
    }
    return result;
  }

  execute() {
    if (this.ast.type === 'Program') {
      return this.executeStatementList(this.ast.body);
    }
  }

  evalExpression(expression) {
    return this['eval'+expression.type](expression);
  }

  evalBinaryExpression(expression) {
    switch (expression.operator) {
      case '+':
        return this.evalExpression(expression.left) + this.evalExpression(expression.right)
      case '-':
        return this.evalExpression(expression.left) - this.evalExpression(expression.right)
      case '>':
        return this.evalExpression(expression.left) > this.evalExpression(expression.right)
      case '<':
        return this.evalExpression(expression.left) < this.evalExpression(expression.right)
      case '==':
        return this.evalExpression(expression.left) === this.evalExpression(expression.right)
    }
  }

  evalAssignmentExpression(expression) {
    switch (expression.operator) {
      case '=':
        return this.globalVars[expression.left.name].value = this.evalExpression(expression.right);
      default:
        throw new Error('unknown operator: '+expression.operator);
    }
  }

  evalLiteral(literal) {
    return literal.value;
  }

  evalIdentifier(identifier) {
    return this.globalVars[identifier.name].value;
  }
}

module.exports = Interpreter;
