'use strict';

var app = require('express')();
var model = require('./schema');
var Sequelize = require('sequelize');

model.sequelize.sync({
  force: true
}).then(function() {
  app.listen(4000, function() {
    console.log("done");
  });
}).then(function(err) {
  console.log('error', err);
});
