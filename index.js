var express = require('express');
var favicon = require('serve-favicon');
var app = express();

// routes
var autocomplete = require('./lib/routes/autocomplete');
var translate    = require('./lib/routes/translate');
var home         = require('./lib/routes/home');
var notFound     = require('./lib/routes/404');

var config = require('./config');


app.use(favicon(config.root + '/favicon.ico'));
app.use(express.static(config.root));
app.use('/entry', home);
app.use('/cl', home);
app.use('/translate', translate);
app.use('/autocomplete', autocomplete);

// 404
app.use(notFound);

module.exports = app;