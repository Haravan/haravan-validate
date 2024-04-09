# haravan-validate

Simple express middleware to validate haravan webhooks

## Install

```bash
$ npm install --save haravan-validate
```

## Usage

```js
const express = require("express");
const HaravanValidate = require("haravan-validate");
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const middlewareValidate = new HaravanValidate(CLIENT_SECRET);
const app = express();

// make sure the haravan validate middleware
// is added before express.json()
app.use(middlewareValidate);
app.use(express.json());

app.post("/webhook", function (req, res) {
	// validate the request is from haravan
	if (!req.fromHaravan()) {
		return res.status(401).send();
	}

	// send success notification to haravan
	// done before to prevent timeout
	res.status(200).send();

	const body = req.body;
	// process webhook
});
```

## Test

```bash
$ npm test
```
