'use strict';
module.exports = function(sequelize, DataTypes) {
  var plants = sequelize.define('plants', {
    commonName: DataTypes.STRING,
    state: DataTypes.STRING,
    county: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return plants;
};