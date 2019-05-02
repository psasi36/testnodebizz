"use strict";
var express = require("express");

module.exports = (req, res) => {
	let client = req.db;
	client.prepare(
		//		`SELECT SESSION_USER, CURRENT_SCHEMA FROM "DUMMY"`,
		'SELECT "ID","TITLE","STOCK" FROM "MY_BOOKSHOP_BOOKS"',
		(err, statement) => {
			if (err) {
				console.log('Prepare Error: ', err);
				return res.type("text/plain").status(500).send("Preapre ERROR: " + err.toString());
			}
			statement.exec([],
				(err, results) => {
					if (err) {
						console.log('Exec Error: ', err);
						return res.type("text/plain").status(500).send("Exec ERROR: " + err.toString());
					} else {
						var result = JSON.stringify({
							Books: results
						});
						return res.type("application/json").status(200).send(result);
					}
				});
			return null;
		});
};