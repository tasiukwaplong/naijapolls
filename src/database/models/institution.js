const passwordHash = require("password-hash");
const MSG = require("../../helpers/messages");
const authController = require('../../controllers/authController');

module.exports = (sequelize, DataTypes) => {
  const Institution = sequelize.define(
    "Institution",
    {
      email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true,
      },
      temp_email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: {
            args: [3, 100],
            msg: `${MSG.ERROR.LESS_CHARACTERS} for email`,
          },
          notNull: {
            msg: MSG.ERROR.EMAIL_EMPTY,
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: MSG.ERROR.INVALID_PASSWORD,
          },
        },
      },
      slots: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: {
            args: [2, 100],
            msg: `${MSG.ERROR.LESS_CHARACTERS} for type of institution`,
          },
        },
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        notEmpty: false,
        validate: {
          len: {
            args: [2, 100],
            msg: `${MSG.ERROR.LESS_CHARACTERS} for name of institution`,
          },
          notNull: {
            msg: MSG.ERROR.INPUT_INVALID,
          },
        },
      },
      short_description: {
        type: DataTypes.STRING(100),
        allowNull: false,
        notEmpty: false,
        validate: {
          len: {
            args: [3, 200],
            msg: `${MSG.ERROR.LESS_CHARACTERS} for description of institution`,
          },
          notNull: {
            msg: MSG.ERROR.INPUT_INVALID,
          },
        },
      },
      approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      contact_phone: {
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
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      block: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      votes: {
        type: DataTypes.TEXT
      },
      voting_description: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      voting_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      hooks: {
        beforeCreate: (Institution) => {
          Institution.password = passwordHash.generate(Institution.password);
          // authController.sendConfirmationEmail(Institution.temp_email, Institution.token, Institution.name);
        },
        afterCreate: (Institution) => {
          // Institution.password = passwordHash.generate(Institution.password);
          authController.sendConfirmationEmail(Institution.temp_email, Institution.token, Institution.name);
        },
      },
    }
  );
  return Institution;
};
