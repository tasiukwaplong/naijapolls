'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Contestants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      post: {
        type: Sequelize.STRING,
        allowNull: false
      },
      owner_id: {
        type: Sequelize.STRING(10)
      },
      votes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      extra: {
        type: Sequelize.STRING,
        allowNull: true
      },
      post_extra: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      ban: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('Contestants');
  }
};