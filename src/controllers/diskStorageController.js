const path = require("path");
const fs = require("fs");
const VideoModel = require("../models/videoModel");

class DiskStorageController {
  static async getVideoUrl(req, res, next) {
    try {
      const videoId = req.params.videoId;
      const video = await VideoModel.findByPk(videoId);

      const options = {
        root: path.resolve(__dirname, "..", ".."),
      };

      console.log("hello worldd from diskcontroller");
      res.sendFile(video.videoFilepath, options);
    } catch (error) {
      console.log(error.message);
    }
  }

  static async deleteFromDisk(req, res) {
    try {
      const videoId = req.params.videoId;
      const video = await VideoModel.findByPk(videoId);

      if (video.videoFilepath) {
        fs.unlink(video.videoFilepath, (err) => {
          if (err) {
            console.error(err.message);
            res.status(400).send(err.message);
          }
        });
      }
      if (video.audioFilePath) {
        fs.unlink(video.audioFilePath, (err) => {
          if (err) {
            console.error(err.message);
            res.status(400).send(err.message);
          }
        });
      }

      await VideoModel.destroy({
        where: {
          id: videoId,
        },
      });

      return res.send("File Deleted successfully");
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = DiskStorageController;
