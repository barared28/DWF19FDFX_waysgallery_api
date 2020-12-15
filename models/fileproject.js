"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FileProject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FileProject.belongsTo(models.Project, {
        as: "project",
        foreignKey: "projectId",
      });
    }
  }
  FileProject.init(
    {
      fileName: DataTypes.STRING,
      projectId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "FileProject",
    }
  );
  return FileProject;
};
