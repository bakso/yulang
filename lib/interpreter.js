'use strict';

let Scope = require('./scope');
let walk = require('./walker').walk;
let GLOBAL = require('./global');

const RETURN_STATEMENT_RESULT = 1;
const BREAK_STATEMENT_RESULT = 2;
const CONTINUE_STATEMENT_RESULT = 3;

class Interpreter {
  constructor(ast) {
    this.ast = ast;
    this.initScope();
    this.scope = this.ast.scope;
  }

  initScope() {
    walk(this.ast, {
      Program: function(node) {
        node.scope = new Scope({
          name: 'global'
        })
      },
      BlockStatement: function(node, scope) {
        node.scope = new Scope({
          name: 'local',
          super: scope
        });
      },
      VariableDeclarator: function(node, scope) {
        let name = node.id.name;
        let val = null;
        if (node.init) {
          if (node.init.type === 'Literal') {
            val = node.init.value;
          }
        }
        scope.define(name, val, node);
      },
      FunctionDeclarationStatement: function(node, scope) {
        let name = node.id.name;
        scope.define(name, noop, node);
      }
    });
  }

  executeVariableDeclarator(statement, scope) {
    let init = statement.init;
    let name = statement.id.name;
    if (init && init.type !== 'Literal') {
      scope.assign(name, this.evalExpression(init, scope));
    }
    return scope.resolve(name).value;
  }

  executeWhileStatement(statement, scope) {
    while (true) {
      var conditionResult = this.evalExpression(statement.condition, scope);
      if (conditionResult === false || typeof conditionResult !== 'boolean') {
        break;
      }
      var result;
      try {
        result = this.executeBlockStatement(statement.body);
      } catch (r) {
        if (r instanceof Error) {
          throw r
        }
        result = r;
      }
      if (result && result.type === BREAK_STATEMENT_RESULT) {
        break;
      }
    }
  }

  executeExpressionStatement(statement, scope) {
    return this.evalExpression(statement.expression, scope);
  }

  executeIFStatement(statement, scope) {
    var testResult = this.evalBinaryExpression(statement.test, scope);
    if (testResult) {
      this.executeBlockStatement(statement.consequent)
    }
  }

  executeFunctionDeclarationStatement(statement, scope) {
    //TODO: support function parameter
  }

  getRefFunc(symbol) {
    if (symbol !== null && symbol.type === 'ref') {
      return this.getRefFunc(symbol.value);
    }
    return symbol;
  }

  getRefSystemFunc(name) {
    return GLOBAL[name] ? GLOBAL[name] : null;
  }

  evalCallExpression(expression, scope) {
    let callee = expression.callee;
    let name = callee.name;
    let symbol = scope.resolve(name);
    symbol = this.getRefFunc(symbol);
    if (symbol === null) {
      let gfunc = this.getRefSystemFunc(name);
      if (gfunc === null) {
        throw new Error(`function ${name} is not defined!`);
      } else {
        let args = expression.arguments;
        let argsValue = [];
        args && args.forEach(function(arg) {
          let value = this.evalExpression(arg, scope);
          argsValue.push(value);
        }.bind(this));
        return gfunc.apply(null, argsValue);
      }
    }    
    let ast = symbol.node;
    let result;
    try {
      result = this.executeBlockStatement(ast.body);
    } catch (r) {
      if (r instanceof Error) {
        throw r
      }
      result = r;
    }
    if (result && result.type === RETURN_STATEMENT_RESULT) {
      result = result.value;
    }
    return result;
  }

  executeBlockStatement(statement) {
    return this.executeStatementList(statement.body, statement.scope);
  }

  executeBreakStatement(statement, scope) {
    throw {
      type: BREAK_STATEMENT_RESULT
    }
  }

  executeReturnStatement(statement, scope) {
    throw {
      type: RETURN_STATEMENT_RESULT,
      value: this.evalExpression(statement.argument, scope)
    }
  }

  executeStatementList(statmentList, scope) {
    var result;
    for (var i = 0, len = statmentList.length; i < len; i++) {
      var statement = statmentList[i];
      result = this['execute'+statement.type](statement, scope);
    }
    return result;
  }

  execute() {
    if (this.ast.type === 'Program') {
      return this.executeStatementList(this.ast.body, this.scope);
    }
  }

  evalExpression(expression, scope) {
    return this['eval'+expression.type](expression, scope);
  }

  evalBinaryExpression(expression, scope) {
    switch (expression.operator) {
      case '+':
        return this.evalExpression(expression.left, scope) + this.evalExpression(expression.right, scope)
      case '-':
        return this.evalExpression(expression.left, scope) - this.evalExpression(expression.right, scope)
      case '>':
        return this.evalExpression(expression.left, scope) > this.evalExpression(expression.right, scope)
      case '<':
        return this.evalExpression(expression.left, scope) < this.evalExpression(expression.right, scope)
      case '>=':
        return this.evalExpression(expression.left, scope) >= this.evalExpression(expression.right, scope)
      case '<=':
        return this.evalExpression(expression.left, scope) <= this.evalExpression(expression.right, scope)
      case '==':
        return this.evalExpression(expression.left, scope) === this.evalExpression(expression.right, scope)
    }
  }

  evalAssignmentExpression(expression, scope) {
    switch (expression.operator) {
      case '=':
        let name = expression.left.name;
        let val = this.evalExpression(expression.right, scope);
        scope.assign(name, val);
        return val;
      default:
        throw new Error('unknown operator: '+expression.operator);
    }
  }

  evalLiteral(literal) {
    return literal.value;
  }

  evalIdentifier(identifier, scope) {
    let symbol = scope.resolve(identifier.name);
    if (symbol.type === 'function') {
      return symbol;
    }
    return symbol.value;
  }
}

function noop(){}

module.exports = Interpreter;
