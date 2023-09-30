const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class VideoModel extends Model {}

VideoModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    path: {
      type: DataTypes.TEXT,
    },
    meta: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    underscored: true,
    tableName: "video",
  }
);

module.exports = VideoModel;
