const express = require("express");

const DiskStorageController = require("../controllers/diskStorageController");

const router = express.Router();

router.get("/:videoId", DiskStorageController.getVideoUrl);
router.delete("/:videoId", DiskStorageController.deleteFromDisk);

module.exports = router;
