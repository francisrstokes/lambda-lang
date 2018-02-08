const {createToken, Lexer} = require('chevrotain');

const LAMBDA = createToken({name: 'LAMBDA', pattern: /λ/});
const IDENTIFIER = createToken({name: 'IDENTIFIER', pattern: /[a-zA-Z]([a-zA-Z0-9]+)?/});
const LPAREN = createToken({name: 'LPAREN', pattern: /\(/});
const RPAREN = createToken({name: 'RPAREN', pattern: /\)/});
const WHITESPACE = createToken({
  name: 'WHITESPACE',
  pattern: /[\s\n]+/,
  group: Lexer.SKIPPED,
  line_breaks: true
});

const allTokens = [
  WHITESPACE,
  LAMBDA,
  IDENTIFIER,
  LPAREN,
  RPAREN
]

module.exports = {
  LAMBDA,
  IDENTIFIER,
  LPAREN,
  RPAREN,
  WHITESPACE,

  allTokens
};
