'use strict';

module.exports = function(sequelize, DataTypes) {
  var Document = sequelize.define('documents', {
    title: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    createdOn: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        Document.belongsTo(models.roles, {
          foreignKey: 'documentRole',
          targetKey: 'title',
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        });
      }
    }
  });
  return Document;
};
