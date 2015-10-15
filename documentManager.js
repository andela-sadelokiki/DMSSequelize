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

  //Method finds or creates a role, creates a user and assigns role to user on user creation
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

//Methos gets all created users
  getAllUsers: function() {
    return User.findAll();
  },

//Method creates a role
  createRole: function(title) {
    return Role.create({
      title: title
    });
  },

//Methos gets all created roles
  getAllRoles: function() {
    return Role.findAll({
      where: {}
    });
  },

//Method finds or creates a role, creates a document, and assigns role to document on document creation
  createDocument: function(title, role) {
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
      Document.create({
        title: title,
        createdOn: publishedOn,
        documentRole: role
      });
    });
  },

//Method gets all created documents
  getAllDocuments: function(limit) {
    return Document.findAll({
      limit: limit,
      order: '"createdAt" DESC'
    });
  },

//Method gets all documents based on roles that can access the document
  getAllDocumentsByRole: function(role, limit) {
    return Document.findAll({
      where: {
        documentRole: role,
      },
      limit: limit,
      order: '"createdAt" DESC'
    });
  },

//Method gets all documents based on date published
  getAllDocumentsByDate: function(date, limit) {
    return Document.findAll({
      where: {
        createdOn: date
      },
      limit: limit
    });
  }

};
