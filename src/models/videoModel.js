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
    videoFilepath: {
      type: DataTypes.TEXT,
    },
    audioFilePath: {
      type: DataTypes.TEXT,
    },
    mimeType: {
      type: DataTypes.TEXT,
    },
    transcription: {
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
