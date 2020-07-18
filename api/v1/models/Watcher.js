'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Watcher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Watcher.init({
    stopId: DataTypes.INTEGER,
    status: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Watcher',
  });
  return Watcher;
};