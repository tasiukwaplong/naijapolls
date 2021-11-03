'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Voters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      phone: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      votes: {
        type: Sequelize.TEXT
      },
      block: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      owned_by: {
        type: Sequelize.STRING
      },
      pin:{
        type: Sequelize.STRING,
        allowNull: true
      },
      ban: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Voters');
  }
};