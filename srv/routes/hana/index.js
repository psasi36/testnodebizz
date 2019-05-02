const models = require('express').Router();

const user = require('./user');
models.get('/', user);

const all = require('./all');
models.get('/all', all);

const hello = require('./hello');
models.get('/hello', hello);

const express = require('./express');
models.get('/express', express);

const async_test = require('./async_test');
models.get('/async_test', async_test);

const await_test = require('./await_test');
models.get('/await_test', await_test);

const single = require('./single');
models.get('/book/:bookId', single);

module.exports = models;