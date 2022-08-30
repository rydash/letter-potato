'use strict';
const querystring = require('querystring');
const request     = require('./request.js');

const stringify = (options) => {
  if(typeof options === 'string'){
    return encodeURI(options);
  }
  return querystring.stringify(options);
};

const wrap = (handler) => {
  return args => request(handler(args));
};

module.exports = {
  stringify: wrap(stringify),
  request: wrap(stringify),
  words: wrap(options => `words?${stringify(options)}`),
  sug: wrap(options => `sug?${stringify(options)}`)
};
