const {compose} = require('ramda');
const {nth} = require('ramda');
const deepCopy = compose(JSON.parse, JSON.stringify);

module.exports = {
  first: nth(0),
  deepCopy
};
