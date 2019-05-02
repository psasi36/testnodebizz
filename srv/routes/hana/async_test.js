"use strict";
var express = require("express");
var async = require("async");

module.exports = (req, res) => {
	let client = req.db;
	async.waterfall([
		function prepare(callback) {
			client.prepare(`SELECT SESSION_USER, CURRENT_SCHEMA 
				            	  FROM "DUMMY"`,
				(err, statement) => {
					callback(null, err, statement);
				});
		},

		function execute(err, statement, callback) {
			statement.exec([], (execErr, results) => {
				callback(null, execErr, results);
			});
		},
		function response(err, results, callback) {
			if (err) {
				res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
			} else {
				var result = JSON.stringify({
					Objects: results
				});
				res.type("application/json").status(200).send(result);
			}
			return callback();
		}
	]);
};