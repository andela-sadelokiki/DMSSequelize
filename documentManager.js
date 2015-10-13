'use strict';

var User = require('./schema').users,
  Role = require('./schema').roles,
  Document = require('./schema').documents,
  Sequelize = require('sequelize'),
  sequelize = new Sequelize('susan', 'sue', 'susan', {
    dialect: 'postgres',
    port: 5432,
  });

module.exports = {

  createUser: function(first, last, title) {
    var user, roleName;
    user = {
      firstname: first,
      lastname: last,
      UserRole: title
    }
    return Role.findOrCreate({
      where: {
        title: title
      }
    }).then(function() {
      User.findOrCreate({
        where: {
          firstname: first,
          lastname: last,
          UserRole: title
        }
      });
    });
  },

  getAllUsers: function() {
    return User.findAll();
  },

  createRole: function(title) {
    return Role.create({
      title: title
    });
  },

  getAllRoles: function() {
    return Role.findAll({
      where: {}
    });
  },

  createDocument: function(title, role, userFirstName, userLastName) {
    var dateCreated = new Date();
    var currentDate = dateCreated.getDate();
    var currentMonth = dateCreated.getMonth();
    var currentYear = dateCreated.getFullYear();
    var publishedOn = currentDate + '-' + currentMonth + '-' + currentYear;

    return Role.findOrCreate({
      where: {
        title: role
      }
    }).then(function() {
      User.findOrCreate({
        where: {
          firstname: userFirstName,
          lastname: userLastName,
          UserRole: role
        }
      });
    }).then(function() {
      Document.create({
        title: title,
        createdOn: publishedOn,
        documentRole: role
      });
    });
  },

  getAllDocuments: function(limit) {
    return Document.findAll({
      limit: limit,
      order: '"createdAt" DESC'
    });
  },

  getAllDocumentsByRole: function(role, limit) {
    return Document.findAll({
      where: {
        documentRole: role,
      },
      limit: limit,
      order: '"createdAt" DESC'
    });
  },

  getAllDocumentsByDate: function(date, limit) {
    return Document.findAll({
      where: {
        createdOn: date
      },
      limit: limit
    });
  }

};
