const {Parser} = require('chevrotain');
const {
  LAMBDA,
  NUMBER,
  IDENTIFIER,
  LPAREN,
  RPAREN,
  PLUS,
  WHITESPACE
} = require('./tokens');

const allTokens = [
  LAMBDA,
  IDENTIFIER,
  LPAREN,
  RPAREN,
  WHITESPACE
];

/*

λx λy x
expr : indentifier
       | Lambda indentifier expr
       | (expr)
       | expr expr
*/

class LambdaParser extends Parser {
  constructor(input) {
    super(input, allTokens, { outputCst: true })
    const $ = this;

    $.RULE('program', () => {
      $.MANY(() => {
        $.SUBRULE($.expr);
      });
    });

    $.RULE('expr', () => {
      $.OR([
        {ALT: () => $.SUBRULE($.identifier)},
        {ALT: () => $.SUBRULE($.abstraction)},
        {ALT: () => $.SUBRULE($.parenExpr)}
      ])
    });

    $.RULE('parenExpr', () => {
      $.CONSUME(LPAREN);
      $.SUBRULE($.expr);
      $.CONSUME(RPAREN);
    })

    $.RULE('identifier', () => {
      $.CONSUME(IDENTIFIER);
    });

    $.RULE('abstraction', () => {
      $.CONSUME(LAMBDA);
      $.CONSUME(IDENTIFIER);
      $.MANY(() => $.SUBRULE($.expr));
    });

    Parser.performSelfAnalysis(this);
  }
}

module.exports = LambdaParser;