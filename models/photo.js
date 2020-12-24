"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Photo.belongsTo(models.Post, {
        as: "post",
        foreignKey: "postId",
      });
    }
  }
  Photo.init(
    {
      postId: DataTypes.INTEGER,
      image: DataTypes.STRING,
      width: DataTypes.INTEGER,
      height: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Photo",
    }
  );
  return Photo;
};
