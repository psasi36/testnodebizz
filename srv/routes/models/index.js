const models = require('express').Router();

const all = require('./all');
models.get('/', all);

const single = require('./single');
models.get('/:modelId', single);

const cars = require('./cars');
models.use('/:modelId/cars', cars);

const findObject = require('../../utils/findObject');
models.param('modelId', findObject('model'));

module.exports = models;