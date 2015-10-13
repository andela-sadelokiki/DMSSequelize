'use strict';

var fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize'),
  sequelize = new Sequelize('susan', '', '', {
    dialect: 'postgres',
    port: 5432,
  }),
  database = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0 && file !== 'index.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    database[model.name] = model;
  });

Object.keys(database).forEach(function(modelName) {
  if ('associate' in database[modelName]) {
    database[modelName].associate(database);
  }
});

database.sequelize = sequelize;
database.Sequelize = Sequelize;

module.exports = database;
