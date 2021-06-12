const request = require('../lib/request.js');

/*request('/words?ml=ringing in the ears')
  .then(response => {
    //console.log(response.body);
    console.log('request test was successful!');
  })
  .catch(error => {
    console.log(error.response.body);
  });*/

const datamuse = require('../index.js');

/*console.log(query.stringify({
  ml: 'ringing in the ears'
}));*/

//words with a meaning similar to ringing in the ears
const assertify = (msg, testPromise) => {
  testPromise()
  .then((json) => {
    console.log(`${msg}: successful!`);
  })
  .catch(() => {
    console.error(`${msg}: failed!`);
    process.exit(1);
  });
};

assertify('request: words with a meaning similar to "ringing in the ears"', () => {
  return datamuse.request('words?ml=ringing in the ears');
});

assertify('words: words with a meaning similar to "ringing in the ears"', () => {
  return datamuse.words({
    ml: 'ringing in the ears'
  });
});

assertify('sug: suggestions for the user if they have typed in "rawand" so far', () => {
  return datamuse.sug({
    s: 'rawand'
  });
});
