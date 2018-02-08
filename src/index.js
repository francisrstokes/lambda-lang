const lexer = require('./lexer');
const Parser = require('./parser');
const {drop, curry, merge} = require('ramda');
const {deepCopy} = require('./util');
const {simpleExpr, flattenParenExpr, getFunctionVariable, branchToString} = require('./lambda-util');

const program = '(λb b (λc λd d) (λe λf e)) (λg λh g)';

const res = lexer.tokenize(program);
const parser = new Parser([]);

parser.input = res.tokens;
const cst = parser.program();


const substituteInFnExpr = curry((arg, varName, fnExpr) => fnExpr.map(expr => {
  const simple = simpleExpr(expr);
  if (simple.name === 'identifier' && getFunctionVariable(simple) === varName) {
    return arg;
  }

  if (simple.name === 'abstraction') {
    return {
      children: merge(
        simple.children,
        {expr: substituteInFnExpr(arg, varName, deepCopy(simple.children.expr)) }
      ),
      name: 'abstraction'
    };
  }

  return expr;
}));


const substitute = (branch) => {
  if (branch.length < 2) {
    return simpleExpr(branch);
  }
  const f = simpleExpr(branch[0]);
  const arg = flattenParenExpr(branch[1]);

  if (f.name !== 'abstraction') {
    throw new Error('Expected function');
  }

  const varName = getFunctionVariable(f);
  const fnExpr = deepCopy(f.children.expr);

  const substitutedExpr = substituteInFnExpr(arg, varName, fnExpr);

  return substitute([
    ...substitutedExpr,
    ...drop(2, branch)
  ]);
};

const out = branchToString(substitute(cst.children.expr));
console.log(out);
