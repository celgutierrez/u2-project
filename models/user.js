'use strict ';
var bcrypt = require('bcryptjs');


module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define('user', {
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: {
                    msg: "Invalid email address"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [6, 20],
                    msg: "Password must be between 6-20 characters long."
                }
            }
        },
        facebookId: DataTypes.STRING,
        facebookToken: DataTypes.STRING
    }, {
        hooks: {
            beforeCreate: function(user, options, cb) {
                if (user && user.password) {
                    var hash = bcrypt.hashSync(user.password, 10);
                    user.password = hash;
                }
                cb(null, user);
            }
        },

        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        },
        instanceMethods: {
            isValidPassword: function(enteredPassword) {
                return bcrypt.compareSync(enteredPassword, this.password);
            },
            toJSON: function() {
                var data = this.get();
                delete data.password;
                return data;
            },
            getFullName: function() {
                return this.firstName + " " + this.lastName;
            }
        }
    });
    return user;
};
