const {Lexer} = require('chevrotain');
const { allTokens} = require('./tokens');

module.exports = new Lexer(allTokens);