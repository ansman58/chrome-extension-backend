const fs = require("fs");
const Video = require("../models/videoModel");

class VideoController {
  static async addVideo(req, res) {
    try {
      console.log("file", req.file);
      const videoPath = req.file.path;
      const videoName = req.file.originalname;

      // Store video information in the database
      const video = await Video.create({
        name: videoName,
        path: videoPath,
        meta: JSON.stringify(req.file),
      });

      // Respond with a success message or relevant information about the uploaded video.
      res.json({ message: "Video uploaded successfully", videoId: video.id });
    } catch (error) {
      console.error("Error uploading video:", error);
      res
        .status(500)
        .json({ error: "Error uploading video", msg: error.message });
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

      // Create a readable stream for the video file
      const videoStream = fs.createReadStream(videoPath);

      // Set the response headers
      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Accept-Ranges", "bytes");

      // Check for the Range header
      const range = req.headers.range;
      if (range) {
        const positions = range.replace(/bytes=/, "").split("-");
        const start = parseInt(positions[0], 10);
        const end = positions[1] ? parseInt(positions[1], 10) : undefined;

        if (!isNaN(start) && (!isNaN(end) || end === undefined)) {
          res.status(206); // Partial Content
          const contentLength = end ? end - start + 1 : undefined;
          if (contentLength !== undefined) {
            res.setHeader("Content-Length", contentLength.toString());
            res.setHeader(
              "Content-Range",
              `bytes ${start}-${end}/${video.size}`
            );
            videoStream.pipe(res);
            return;
          }
        }
      }

      // If no valid range is specified, serve the entire video
      res.status(200); // OK
      videoStream.pipe(res);
    } catch (error) {
      console.error("Error streaming video:", error);
      res.status(500).json({ error: "Error streaming video" });
    }
  }
}

module.exports = VideoController;
