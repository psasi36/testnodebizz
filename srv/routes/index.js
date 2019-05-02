const routes = require('express').Router();

routes.get('/conn', (req, res) => {
	res.status(200).json({
		message: 'Connected!'
	});
});

const models = require('./models');
routes.use('/models', models);

const cars = require('./cars');
routes.use('/cars', cars);

const hana = require('./hana');
routes.use('/hana', hana);

module.exports = routes;