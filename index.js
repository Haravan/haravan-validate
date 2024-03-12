"use strict";

const crypto = require("crypto");

function haravan(secret) {
	if (!(this instanceof haravan)) return new haravan(secret);

	if (!secret) throw new Error("secret is required");

	return function (req, res, next) {
		const signature = req.get("x-haravan-hmacsha256");

		if (signature) {
			let raw = "";
			req.haravanBody = raw;

			req.on("data", function (chunk) {
				raw += chunk;
			});

			req.on("end", function () {
				req.haravanBody = raw;
			});

			req.fromHaravan = function () {
				const sh = crypto.createHmac("sha256", secret).update(Buffer.from(req.haravanBody, "utf8")).digest("base64");
				return sh === signature;
			};

			next();
		} else {
			req.fromHaravan = function () {
				return false;
			};

			next();
		}
	};
}

module.exports = haravan;
