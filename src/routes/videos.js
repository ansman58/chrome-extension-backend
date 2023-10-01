const express = require("express");
const VideoController = require("../controllers/videoController");
const audioTranscriber = require("../services/audioTranscriber");

const router = express.Router();

router.post("/", VideoController.addVideo);
router.get("/:videoId", audioTranscriber, VideoController.getVideo);
router.get("/", VideoController.getAllVideos);

module.exports = router;
