const fs = require("fs");
const Video = require("../models/videoModel");
const path = require("path");
const { exec } = require("child_process");
const videoToAudioConverter = require("../services/videoToAudioConverter");

class VideoController {
  static async addVideo(req, res, next) {
    try {
      console.log("file", req.file);
      if (!req.file) {
        return res.status(400).json({ error: "Please upload a video file" });
      }
      const videoPath = req.file.path;
      const videoName = req.file.originalname;

      videoToAudioConverter(req, res, next);

      // Store video information in the database
      const video = await Video.create({
        name: videoName,
        path: videoPath,
        mimeType: req.file.mimetype,
        meta: JSON.stringify(req.file),
      });

      // Respond with a success message or relevant information about the uploaded video.
      res.json({
        message: "Video uploaded successfully",
        videoId: video,
      });
    } catch (error) {
      console.error("Error uploading video:", error);
      res
        .status(500)
        .json({ error: "Error uploading video", msg: error.message });
    }
  }

  static async getVideo(req, res) {
    try {
      const videoId = req.params.videoId;

      if (!videoId) {
        return res.status(400).send("Video ID is required");
      }

      const video = await Video.findByPk(videoId);

      if (!video) {
        return res
          .status(404)
          .send("Video not found. Please provide a valid video ID");
      }

      const videoPath = video.path;
      const mimeType = video.mimeType;

      const fileStat = fs.statSync(videoPath);
      const fileSize = fileStat.size;

      // Check for the Range header
      const range = req.headers.range;
      // Example: Range = "bytes=32324-"
      // Example: Range = "bytes=32324-54543"

      if (range) {
        const CHUNK_SIZE = 10 ** 6; // 1MB
        const startByte = range.replace(/bytes=/, "").split("-");
        const start = Number(startByte[0]);

        const end = startByte[1]
          ? Number(startByte[1])
          : Math.min(start + CHUNK_SIZE - 1, fileSize - 1);

        // Create headers
        res.writeHead(206, {
          "Content-Type": mimeType,
          "Accept-Ranges": "bytes",
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Content-Length": end - start + 1,
        });

        // Create a readable stream for the video file with a specific range
        const videoStream = fs.createReadStream(videoPath, {
          start,
          end,
        });

        videoStream.pipe(res);
        return;
      } else {
        // No range header
        res.writeHead(200, {
          "Content-Type": mimeType,
          "Accept-Ranges": "bytes",
          "Content-Length": fileSize,
        });

        const videoStream = fs.createReadStream(videoPath);
        videoStream.pipe(res);
        // res.send("Hello World")
        // console.log('helo world')
      }
    } catch (error) {
      console.error("Error streaming video:", { error: error.message });
      res.status(500).json({ error: "Error streaming video" });
    }
  }

  // Middleware for streaming video
  static async streamVideo(req, res) {
    try {
      const videoId = req.params.videoId;

      if (!videoId) {
        return res.status(400).send("Video ID is required");
      }

      const video = await Video.findByPk(videoId);

      if (!video) {
        return res
          .status(404)
          .send("Video not found. Please provide a valid video ID");
      }

      const videoPath = video.path;
      const mimeType = video.mimeType;

      const fileStat = fs.statSync(videoPath);
      const fileSize = fileStat.size;

      // Check for the Range header
      const range = req.headers.range;

      if (range) {
        const CHUNK_SIZE = 10 ** 6; // 1MB
        const [start, end] = range
          .replace(/bytes=/, "")
          .split("-")
          .map(Number);

        const chunkStart = isNaN(start) ? 0 : start;
        const chunkEnd = isNaN(end)
          ? Math.min(chunkStart + CHUNK_SIZE - 1, fileSize - 1)
          : end;

        const contentLength = chunkEnd - chunkStart + 1;

        res.writeHead(206, {
          "Content-Type": mimeType,
          "Accept-Ranges": "bytes",
          "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${fileSize}`,
          "Content-Length": contentLength,
        });

        // Create a readable stream for the video file with the specified range
        const videoStream = fs.createReadStream(videoPath, {
          start: chunkStart,
          end: chunkEnd,
        });

        videoStream.pipe(res);
      } else {
        // No range header, send the whole video
        res.writeHead(200, {
          "Content-Type": mimeType,
          "Accept-Ranges": "bytes",
          "Content-Length": fileSize,
        });

        const videoStream = fs.createReadStream(videoPath);
        videoStream.pipe(res);
      }
    } catch (error) {
      console.error("Error streaming video:", error.message);
      res.status(500).json({ error: "Error streaming video" });
    }
  }
}

module.exports = VideoController;
