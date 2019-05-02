"use strict";
var express = require("express");
var async = require("async");

module.exports = async(req, res) => {
	try {
		const dbClass = require("../../utils/dbPromises");
		let db = new dbClass(req.db);
		const statement = await db.preparePromisified('SELECT ID,TITLE,STOCK FROM MY_BOOKSHOP_BOOKS');
		const results = await db.statementExecPromisified(statement, []);
		let result = JSON.stringify({
			Books: results
		});
		return res.type("application/json").status(200).send(result);
	} catch (e) {
		return res.type("text/plain").status(500).send(`ERROR: ${e.toString()}`);
	}
};