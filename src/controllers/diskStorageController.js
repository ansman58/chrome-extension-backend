const path = require("path");
const fs = require("fs");
const VideoModel = require("../models/videoModel");

class DiskStorageController {
  static async getVideoUrl(req, res, next) {
    try {
      const videoId = req.params.videoId;
      const video = await VideoModel.findByPk(videoId);

      if (!video) {
        return res.status(404).send("Video not found");
      }

      const options = {
        root: path.resolve(__dirname, "..", ".."),
      };

      console.log("hello world from disk controller");
      res.sendFile(video.videoFilepath, options);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }

  static async deleteFromDisk(req, res) {
    try {
      const videoId = req.params.videoId;
      const video = await VideoModel.findByPk(videoId);

      if (!video) {
        return res.status(404).send("Video not found");
      }

      // if (video.videoFilepath !== null) {
      //   console.log("video file path", video.videoFilepath);
      //   fs.unlinkSync(video.videoFilepath);
      // }
      // if (video.audioFilePath !== null) {
      //   console.log("audio file path", video.audioFilePath);
      //   fs.unlinkSync(video.audioFilePath);
      // }

      await VideoModel.destroy({
        where: {
          id: videoId,
        },
      });

      return res.send("File Deleted successfully");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = DiskStorageController;
