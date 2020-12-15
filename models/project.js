"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Project.belongsTo(models.Transaction, {
        as: "transaction",
        foreignKey: "transactionId",
      });
      Project.hasMany(models.FileProject, {
        as: "file",
        foreignKey: "projectId"
      });
    }
  }
  Project.init(
    {
      transactionId: DataTypes.INTEGER,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Project",
    }
  );
  return Project;
};
