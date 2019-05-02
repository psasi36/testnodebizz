/*eslint no-console: 0, no-unused-vars: 0, no-undef:0, no-process-exit:0*/
/*eslint-env node, es6 */
//	From package.json
//			"postinstall": "npm dedupe && node .build.js",
//			"start": "node ./node_modules/@sap/cds/bin/cds.js serve gen/csn.json",
//			"watch": "nodemon -w . -i node_modules/**,.git/** -e cds -x npm run build"

//		"postinstall": "cds build/all --project .. --clean",
//		"start": "node server.js"

"use strict";
const port = process.env.PORT || 3000;
const server = require("http").createServer();

const cds = require("@sap/cds");
//Initialize Express App for XSA UAA and HDBEXT Middleware
const xsenv = require("@sap/xsenv");
const passport = require("passport");
const xssec = require("@sap/xssec");
const xsHDBConn = require("@sap/hdbext");
const express = require("express");
global.__base = __dirname + "/";

//logging
var logging = require("@sap/logging");
var appContext = logging.createAppContext();

//Initialize Express App for XS UAA and HDBEXT Middleware
var app = express();

// load static files
app.use(express.static('public'));

//Compression
app.use(require("compression")({
	threshold: "1b"
}));

//Helmet for Security Policy Headers
const helmet = require("helmet");
// ...
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
	directives: {
		defaultSrc: ["'self'"],
		styleSrc: ["'self'", "sapui5.hana.ondemand.com"],
		scriptSrc: ["'self'", "sapui5.hana.ondemand.com"]
	}
}));
// Sets "Referrer-Policy: no-referrer".
app.use(helmet.referrerPolicy({
	policy: "no-referrer"
}));

var services = xsenv.getServices({
	uaa: {
		tag: "xsuaa"
	}
}).uaa;

passport.use(new JWTStrategy(services));

// passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
// 	uaa: {
// 		tag: "xsuaa"
// 	}
// }).uaa));
app.use(logging.middleware({
	appContext: appContext,
	logNetwork: true
}));
app.use(passport.initialize());
var hanaOptions = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});
hanaOptions.hana.pooling = true;
app.use(
	passport.authenticate("JWT", {
		session: false
	}),
	xsHDBConn.middleware(hanaOptions.hana)
);

//CDS OData V4 Handler
var options = {
	driver: "hana",
	logLevel: "error"
};
//Use Auto Lookup in CDS 2.10.3 and higher
//Object.assign(options, hanaOptions.hana, {
//	driver: options.driver
//});

cds.connect(options);

var odataURL = "/odata/v4/node.CatalogService/";
// Main app
cds.serve("gen/csn.json", {
		crashOnError: false
	})
	.at(odataURL)
	.with(require("./lib/handlers"))
	.in(app)
	.catch((err) => {
		console.log(err);
		process.exit(1);
	});

// Redirect any to service root
app.get("/", (req, res) => {
	res.redirect(odataURL);
});
app.get("/node", (req, res) => {
	res.redirect(odataURL);
});

//Setup Additonal Node.js Routes
//require("./router")(app, server);
// const router = require("./router");
// app.use('/', router);

// Bring in our dependencies
const routes = require('./routes');

//  Connect all our routes to our application
app.use('/', routes);

// var router = express.Router();
// // middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
// 	console.log('Time: ', Date.now())
// 	next()
// });
// // define the home page route
// router.get('/birds', function (req, res) {
// 	res.send('Birds home page')
// });
// app.use('/', router);

//Start the Server 
server.on("request", app);
server.listen(port, function () {
	console.info(`HTTP Server: ${server.address().port}`);
});