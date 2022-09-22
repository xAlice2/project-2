'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('taskDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      todoId: {
        type: Sequelize.INTEGER
      },
      taskId: {
        type: Sequelize.INTEGER
      },
      complete: {
        type: Sequelize.BOOLEAN
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('taskDetails');
  }
};