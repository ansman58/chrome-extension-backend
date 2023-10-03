const express = require("express");
const VideoController = require("../controllers/videoController");
const audioTranscriber = require("../services/audioTranscriber");
const videoToAudioConverter = require("../services/videoToAudioConverter");

const router = express.Router();

router.post("/", VideoController.addVideo);
router.get("/:videoId", VideoController.getVideo);
router.get("/", VideoController.getAllVideos);
router.get(
  "/transcription/:videoId",
  videoToAudioConverter,
  audioTranscriber,
  VideoController.getVideoTranscription
);

module.exports = router;
