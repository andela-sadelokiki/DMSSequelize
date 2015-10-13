'use strict';

var User = require('./schema').users,
  Role = require('./schema').roles,
  Document = require('./schema').documents,
  Sequelize = require('sequelize'),
  sequelize = new Sequelize('susan', 'sue', 'susan', {
    dialect: 'postgres',
    port: 5432,
  });
