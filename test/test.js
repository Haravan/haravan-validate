var express = require("express"),
	request = require("supertest"),
	assert = require("assert"),
	haravan = require("../"),
	crypto = require("crypto");

describe("haravan-validate", function () {
	it("should throw err if no secret is passed", function () {
		assert.throws(function () {
			haravan();
		}, /secret is required/);
	});

	it("should add fromHaravan function to req", function (done) {
		var app = express();

		app.use(haravan("1234"));
		app.use(express.json());
		app.use(function (req, res, next) {
			if (!req.fromHaravan) return res.status(500).send();
			res.status(200).send();
		});
		var req = request(app);
		req.post("/").send({ name: "evan" }).end(done);
	});

	it("req.fromHaravan should return true on success", function (done) {
		var app = express();

		app.use(haravan("1234"));
		app.use(express.json());
		app.use(function (req, res, next) {
			if (!req.fromHaravan()) return res.status(500).send();
			res.status(200).send();
		});
		var body = {
			name: "evan",
		};
		var headerVal = crypto
			.createHmac("sha256", "1234")
			.update(Buffer.from(JSON.stringify(body), "utf8"))
			.digest("base64");
		var req = request(app);
		req.post("/").set("x-haravan-hmacsha256", headerVal).send(body).end(done);
	});

	it("req.fromHaravan should return false on failure", function (done) {
		var app = express();

		app.use(haravan("1234"));
		app.use(express.json());
		app.use(function (req, res, next) {
			if (req.fromHaravan()) return res.status(500).send();
			res.status(200).send();
		});
		var body = {
			name: "evan",
		};
		var headerVal = crypto
			.createHmac("sha256", "1234")
			.update(Buffer.from(JSON.stringify({ name: "evan2" }), "utf8"))
			.digest("base64");
		var req = request(app);
		req.post("/").set("x-haravan-hmacsha256", headerVal).send(body).end(done);
	});
});
