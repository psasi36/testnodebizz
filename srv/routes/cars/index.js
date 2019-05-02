const cars = require('express').Router();

const all = require('./all');
cars.get('/', all);

const single = require('./single');
cars.get('/:carId', single);

const findObject = require('../../utils/findObject');
cars.param('carId', findObject('car'));

module.exports = cars;