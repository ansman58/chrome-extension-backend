const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class VideoModel extends Model {}

VideoModel.init(
  {
    id: {
      type: DataTypes.UUID,
      // defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
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
    videoUrl: {
      type: DataTypes.TEXT,
    },
    audioUrl: {
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
