'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class taskDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.taskDetails.belongsTo(models.task)
      models.taskDetails.belongsTo(models.todo)
    }
  }
  taskDetails.init({
    todoId: DataTypes.INTEGER,
    taskId: DataTypes.INTEGER,
    complete: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'taskDetails',
  });
  return taskDetails;
};