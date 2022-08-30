[![Build Status](https://api.travis-ci.org/ansteh/datamuse.svg?branch=master)](https://travis-ci.org/ansteh/datamuse)

## Install

Using npm:

```js
npm install datamuse
```

The Datamuse API is a word-finding query engine for developers.
The official website illustrates the kinds of queries you can make: [Datamuse API](http://www.datamuse.com/api/).
This module helps you to make queries and supports promises.

## Usage

Straight forward approach by providing a query.
```js
const datamuse = require('datamuse');

datamuse.request('words?ml=ringing in the ears')
.then((json) => {
  console.log(json);
  //do it!
});

```

Use words as shortcut.
```js
datamuse.words({
  ml: 'ringing in the ears'
})
.then((json) => {
  console.log(json);
  //do it!
});
```

Use sug as shortcut.
```js
datamuse.sug({
  s: 'rawand'
})
.then((json) => {
  console.log(json);
  //do it!
});
```

## License

MIT © [Andre Stehle](https://github.com/ansteh)
