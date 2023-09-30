const express = require("express");
const VideoController = require("../controllers/videoController");

const router = express.Router();

router.post("/", VideoController.addVideo);
router.get("/:videoId", VideoController.getVideo);

module.exports = router;