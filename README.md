# haravan-validate

Simple express middleware to validate haravan web hooks

## Install

```bash
$ npm install --save haravan-validate
```

## Usage

```js
var express = require('express')
  , bodyParser = require('body-parser')
  , Haravan = require('haravan-validate')
  , haravanSecret = process.env.HARAVAN_SECRET

var haravan = new Haravan(haravanSecret)
// make sure the haravan validate middleware
// is added before bodyParser
var middleware = [haravan, bodyParser.json()]

var app = express()

app.post('/webhook', middleware, function(req, res) {
  // validate the request is from haravan
  if (!req.fromHaravan()) {
    return res.status(401).send()
  }

  // send success notification to haravan
  // done before to prevent timeout
  res.status(200).send()

  var body = req.body
  // process webhook
})
```

## Test

```bash
$ npm test
```


## Author

Haravan Team
