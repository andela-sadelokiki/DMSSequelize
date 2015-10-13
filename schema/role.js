'use strict';

module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define('roles', {
    title: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  });
  return Role;
};
