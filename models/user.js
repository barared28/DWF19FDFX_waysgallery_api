"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post, {
        as: "post",
        foreignKey: "createdBy",
      });
      User.hasOne(models.Profile, {
        as: "profile",
        foreignKey: "userId",
      });
      User.hasMany(models.Art, {
        as: "art",
        foreignKey: "userId",
      });
      User.hasMany(models.Transaction, {
        as: "client",
        foreignKey: "orderBy",
      });
      User.hasMany(models.Transaction, {
        as: "seller",
        foreignKey: "orderTo",
      });
      User.belongsToMany(models.User , {
        through : {
          model : "Follows"
        },
        foreignKey : "followerId",
        as : "follower"
      });
      User.belongsToMany(models.User ,{
        through : {
          model : "Follows"
        },
        foreignKey : "followedId",
        as : "followed"
      })
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      fullName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
