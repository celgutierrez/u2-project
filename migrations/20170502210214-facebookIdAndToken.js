'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.addColumn('create-users', 'facebookId', Sequelize.STRING).then(function() {
            return queryInterface.addColumn('create-users', 'facebookToken', Sequelize.STRING);
        });
    },

    down: function(queryInterface, Sequelize) {
        return queryInterface.removeColumn('create-users', 'facebookToken').then(function() {
            return queryInterface.removeColumn('create-users', 'facebookId');
        });
    }

};
