const passwordHash = require("password-hash");
const MSG = require("../../helpers/messages");
const authController = require('../../controllers/authController');

module.exports = (sequelize, DataTypes) => {
  const Voter = sequelize.define(
    "Voter",
    {
      phone: {
        type: DataTypes.STRING(100),
        allowNull: false,
        notEmpty: false,
        validate: {
          len: {
            args: [11, 11],
            msg: `${MSG.ERROR.LESS_CHARACTERS} for phone number`,
          },
          notNull: {
            msg: MSG.ERROR.INPUT_INVALID,
          },
        },
      },
      owned_by: {
        type: DataTypes.STRING(100)
      },
      votes: {
        type: DataTypes.TEXT
      },
      block: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      pin: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ban: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
    },
  );
  return Voter;
};
