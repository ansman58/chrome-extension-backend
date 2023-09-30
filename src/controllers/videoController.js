const VideoModel = require("../models/videoModel");
const fs = require("fs");
const Video = require("../models/videoModel");

class VideoController {
  static async addVideo(req, res) {
    try {
      const videoPath = req.file.path;
      const videoName = req.file.originalname;

      // Store video information in the database
      const video = await VideoModel.create({
        name: videoName,
        path: videoPath,
        meta: JSON.stringify(req.file),
      });

      // Respond with a success message or relevant information about the uploaded video.
      res.json({ message: "Video uploaded successfully", videoId: video.id });
    } catch (error) {
      console.error("Error uploading video:", error);
      res.status(500).json({ error: "Error uploading video" });
    }
  }

  static async getVideo(req, res) {
    const videoId = req.params.videoId;

    try {
      // Find the video by ID in the database
      const video = await Video.findByPk(videoId);

      if (!video) {
        res.status(404).send("Video not found");
        return;
      }

      const videoPath = video.path;
      const videoSize = fs.statSync(videoPath).size;

      const range = req.headers.range;
      if (!range) {
        res.status(400).send("Requires range header");
        return;
      }

      const CHUNK_SIZE = 10 ** 6; // 1MB
      const start = Number(range.replace(/\D/g, ""));
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };
      res.writeHead(206, headers);
      const videoStream = fs.createReadStream(videoPath, { start, end });

      videoStream.pipe(res);
    } catch (error) {
      console.error("Error streaming video:", error);
      res.status(500).json({ error: "Error streaming video" });
    }
  }
}

module.exports = VideoController;
