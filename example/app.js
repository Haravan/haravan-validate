"use strict";

const express = require("express");
const HaravanValidate = require("../index");
var url = require("node:url");

const VERIFY_TOKEN_SECRET = "99ddfa1bb0de08ea7bc3a70af36cf0ac9f6b94dadbf6949ac5903e54f7240971";

const middlewareValidate = new HaravanValidate(VERIFY_TOKEN_SECRET);
const app = express();

// make sure the haravan validate middleware
// is added before express.json()
app.use(middlewareValidate);
app.use(express.json());

//Register webhook: response status 200 and value of hub.challenge
app.get("/webhook", function (req, res) {
	let UrlInfo = url.parse(req.url, true);

	if (UrlInfo.query["hub.challenge"] && UrlInfo.query["hub.verify_token"] && UrlInfo.query["hub.verify_token"] === VERIFY_TOKEN_SECRET) {
		return res.status(200).send(UrlInfo.query["hub.challenge"]);
	} else {
		return res.status(401).send();
	}
});

app.post("/webhook", function (req, res) {
	// validate the request is from haravan
	if (!req.fromHaravan()) {
		return res.status(200).send("401 Unauthorized");
	}

	// send success notification to haravan
	// done before to prevent timeout
	res.status(200).send("OK!");

	const OrgId = req.get("x-haravan-org-id");
	const Topic = req.get("x-haravan-topic");

	const body = req.body;
	// process webhook
});

const port = 3000;
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
