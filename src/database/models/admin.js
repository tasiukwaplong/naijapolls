const passwordHash = require('password-hash');
const MSG = require('../../helpers/messages');

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    username: {
      type: DataTypes.STRING(100), // eslint-disable-line
      unique: true,
      allowNull: false,
      notEmpty: false,
      validate: {
        len: {
          args: [3, 15],
          msg: `${MSG.ERROR.LESS_CHARACTERS}`
        },
        notNull: {
          msg: MSG.ERROR.EMPTY_USERNAME
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [4, 15],
          msg: MSG.ERROR.INVALID_PASSWORD_LENGTH
        },
        notNull: {
          msg: MSG.ERROR.INVALID_PASSWORD
        }
      }
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: `${new Date().getTime()}_${Math.random().toString(36).slice(2)}`
    }
  }, {
    hooks: {
      beforeCreate: (admin) => {
        admin.password = passwordHash.generate(admin.password);
      }
    }
  });
  return Admin;
};
