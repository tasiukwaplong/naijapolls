const passwordHash = require("password-hash");
const MSG = require("../../helpers/messages");
const authController = require('../../controllers/authController');

module.exports = (sequelize, DataTypes) => {
  const Contestant = sequelize.define(
    "Contestant",
    {
      post: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      votes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      extra: {
        type: DataTypes.STRING,
        allowNull: true
      },
      post_extra: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      owner_id: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      ban: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        notEmpty: false
      }
    }
  );
  return Contestant;
};
