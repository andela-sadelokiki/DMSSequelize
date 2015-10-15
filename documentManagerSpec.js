'use strict';

var model = require('./schema');
var documentManager = require('./documentManager.js');

describe('User', function() {
  var roleName;
  beforeEach(function(done) {
    model.roles.create({
      title: 'management'
    }).then(function(role) {
      roleName = role.get({
        plain: true
      });
    }).then(function() {
      model.users.create({
        firstname: 'tola',
        lastname: 'lawal',
        UserRole: roleName.title
      }).then(function(result) {})
      done();
    });
  });

  afterEach(function(done) {
    model.roles.destroy({
      where: {}
    }).then(function() {
      model.users.destroy({
        where: {}
      }).then(function() {
        done();
      });
    });
  });

  it('should validate that a new user created is unique', function(done) {
    model.users.findAndCountAll({
      where: {
        firstname: 'tola',
        lastname: 'lawal',
        UserRole: 'management'
      }
    }).then(function(result) {
      expect(result.count).toBe(1);
      done();
    });
  });
  it('should validate that a new user created has a role defined.', function(done) {
    model.users.findOne({
      where: {
        firstname: 'tola'
      }
    }).then(function(result) {
      expect(result.UserRole).toBe('management');
      done();
    });
  });
  it('should validate that a new user created both first and last names.', function(done) {
    model.users.findOne({
      where: {
        UserRole: 'management'
      }
    }).then(function(result) {
      expect(result.firstname).toBe('tola');
      expect(result.lastname).toBe('lawal');
      done();
    });
  });
  it('should validate that all users are returned when getAllUsers is called', function(done) {
    var users = []
    model.roles.create({
      title: 'attendant'
    }).then(function(role) {
      roleName = role.get({
        plain: true
      });
    }).then(function() {
      model.users.create({
        firstname: 'bolu',
        lastname: 'johnson',
        UserRole: 'management'
      }).then(function() {
        model.users.findAll().then(function(list) {
          console.log('show list of users', list);
          for (var i = 0; i < list.length; i++) {
            users.push(list[i].dataValues)
          }
          expect(users[0].firstname).toBe('tola');
          expect(users[1].lastname).toBe('johnson');
        });
        done();
      });
    });
  });

});

describe('Role', function() {

  beforeEach(function(done) {
    model.roles.destroy({
      where: {}
    }).then(function() {
      model.roles.create({
        title: 'admin'
      }).then(function(result) {});
      done();
    });
  });

  afterEach(function(done) {
    model.roles.destroy({
      where: {}
    }).then(function() {
      done();
    });
  });

  it('should validate that a new role created has a unique title', function(done) {
    model.roles.findAndCountAll({
      where: {
        title: 'admin'
      }
    }).then(function(result) {
      expect(result.count).toBe(1);
      done();
    });
  });

  it('should validate that all roles are returned when getAllRoles is called', function(done) {
    model.roles.create({
      title: 'academic leader'
    }).then(function() {
      model.roles.findAll().then(function(result) {
        expect(result.length).toBe(2);
        done();
      });
    });
  });

});

describe('Document', function() {

  beforeEach(function(done) {
    model.documents.destroy({
      where: {}
    }).then(function() {
      documentManager.createDocument('Contract', 'Junior Developer').then(function(result) {
        console.log('NEW DOCUMENT', result);
        done();
      });
    });
  });

  afterEach(function(done) {
    model.documents.destroy({
      where: {}
    }).then(function() {
      model.roles.destroy({
        where: {}
      }).then(function() {
        done();
      });
    });
  });

  it('should validate that a new user document created has a published date defined.', function(done) {
    model.documents.findOne({
      title: 'Newsletter 1'
    }).then(function(result) {
      console.log('i found it!', result);
      expect(result.dataValues.createdOn).toBeDefined();
      expect(result.dataValues.createdOn).toBe('15-9-2015');
      done();
    });
  });

  it('should  validate that all documents are returned, limited by a specified number, when getAllDocuments is called.', function(done) {
    var documents = [];
    documentManager.createDocument('Rules and Regulation', 'Operation Manager').then(function() {
      documentManager.createDocument('Hospitals', 'Welfare').then(function() {
        documentManager.getAllDocuments(1).then(function(result) {
          console.log('docs', result)
          for (var i = 0; i < result.length; i++) {
            documents.push(result[i].dataValues.title)
          }
          expect(documents[0]).toBe('Rules and Regulation');
          done();
        });
      });
    });
  });

  it('should validate that all documents are returned in order of their published dates, starting from the most recent when getAllDocuments is called.', function(done) {
    documentManager.createDocument('Newsletter 1', 'FELLOW 1').then(function() {
      documentManager.createDocument('Newsletter 2', 'FELLOW 1').then(function() {
        documentManager.createDocument('Newsletter 3', 'FELLOW 3').then(function() {
          documentManager.createDocument('Newsletter 4', 'FELLOW 4').then(function() {
            documentManager.getAllDocuments(4).then(function(documents) {
              expect(documents[0].createdAt).toBeGreaterThan(documents[1].createdAt);
              expect(documents[2].createdAt).toBeGreaterThan(documents[3].createdAt);
              done();
            });
          });
        });
      });
    });
  });

});

describe('Search', function() {

  beforeEach(function(done) {
    model.documents.destroy({
      where: {}
    }).then(function() {
      documentManager.createDocument('Manual', 'Security').then(function() {
        documentManager.createDocument('Letters', 'Security').then(function() {
          documentManager.createDocument('Attendance', 'Class-captain').then(function(result) {
            done();
          });
        });
      });
    });
  });

  afterEach(function(done) {
    model.documents.destroy({
      where: {}
    }).then(function() {
      model.roles.destroy({
        where: {}
      }).then(function() {
        done();
      });
    });
  });

  it('validates that all documents, limited by a specified number and ordered by published date, that can be accessed by a specified role, are returned when getAllDocumentsByRole is called.', function(done) {
    var documents = [];
    documentManager.getAllDocumentsByRole('Security', 2).then(function(result) {
      for (var i = 0; i < result.length; i++) {
        documents.push(result[i].dataValues.title)
      }
      expect(documents.length).toBe(2);
      expect(documents[0]).toBe('Letters');
      expect(documents[1]).toBe('Manual')
      done();
    });
  });

  it('validates that all documents, limited by a specified number, that were published on a certain date, are returned when getAllDocumentsByDate is called.', function(done) {
    var documents = [];
    documentManager.getAllDocumentsByDate('15-9-2015', 3).then(function(result) {
      for (var i = 0; i < result.length; i++) {
        documents.push(result[i].title)
      }
      expect(documents.length).toBe(3);
      expect(documents[0]).toBe('Manual');
      expect(documents[1]).toBe('Letters');
      expect(documents[2]).toBe('Attendance');
      done();
    });
  });

});
