const {path, compose, pipe, values, identity, chain} = require('ramda');
const {first} = require('./util');

const simpleExpr = (cstObj) => {
  const getExpr = pipe(values, chain(identity), first, simpleExpr);
  const getParenExpr = compose(simpleExpr, first);

  switch (cstObj.name) {
    case 'expr': return getExpr(cstObj.children);
    case 'parenExpr': return getParenExpr(cstObj.children.expr);
    default: return cstObj;
  }
};

const flattenParenExpr = (cstObj) => {
  if (cstObj.name === 'parenExpr') {
    return first(cstObj.children.expr);
  }
  return cstObj;
};

const getFunctionVariable = path(['children', 'IDENTIFIER', '0', 'image']);

const branchToString = (branch) => {
  const mapped = branch.map(expr => {
    const simple = simpleExpr(expr);
    switch (simple.name) {
      case 'abstraction': return `(λ${getFunctionVariable(simple)} ${branchToString(simple.children.expr)})`;
      case 'identifier': return `${getFunctionVariable(simple)}`;
      default: return '';
    }
  });
  return `${mapped.join('')} `;
};

module.exports = {
  getFunctionVariable,
  simpleExpr: simpleExpr,
  flattenParenExpr: flattenParenExpr,
  branchToString
};
