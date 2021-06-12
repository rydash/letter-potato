'use strict';
const got = require('got');

const options = {
  json: true
};

module.exports = (postUri) => {
  return got(`https://api.datamuse.com/${postUri}`, options)
    .then(response => response.body);
};
