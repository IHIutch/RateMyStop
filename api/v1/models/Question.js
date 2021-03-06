'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Question.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
      })
      Question.hasMany(models.Answer, {
        foreignKey: 'questionId',
        as: 'prevAnswers',
      })
    }
  }
  Question.init(
    {
      text: DataTypes.STRING,
      type: DataTypes.STRING,
      answers: DataTypes.JSON,
      categoryId: DataTypes.INTEGER,
      active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Question',
    }
  )
  return Question
}
