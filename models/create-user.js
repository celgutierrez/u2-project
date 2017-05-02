'use strict';
module.exports = function(sequelize, DataTypes) {
  var create - user = sequelize.define('create-user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return create - user;
};