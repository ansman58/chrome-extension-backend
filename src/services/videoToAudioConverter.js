const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const VideoModel = require("../models/videoModel");

async function videoToAudioConverter(req, res, next) {
  try {
    const targetDirectory = "public";
    const uploadSubdirectory = "public/audios";

    const video = await VideoModel.findByPk(req.params.videoId);

    if (!video) {
      return res.status(400).send("Video not found");
    }

    const inputFile = video.videoFilepath;

    if (!inputFile) {
      return res.status(400).send("Video path not found");
    }

    const inputFileNameWithoutExtension = path.basename(
      inputFile,
      path.extname(inputFile)
    );

    const outputFile = path.join(
      uploadSubdirectory,
      inputFileNameWithoutExtension + ".mp3"
    );

    const updateModel = await VideoModel.update(
      {
        audioFilePath: outputFile,
      },
      {
        where: {
          id: req.params.videoId,
        },
      }
    );

    if (!updateModel) {
      return res.status(404).send("Error occurred updating model");
    }

    if (!fs.existsSync(targetDirectory)) {
      fs.mkdirSync(targetDirectory);
    }

    if (!fs.existsSync(uploadSubdirectory)) {
      fs.mkdirSync(uploadSubdirectory);
    }

    const ffmpegCommand = `ffmpeg -i "${inputFile}" "${outputFile}"`;

    console.log("ffmpegCommand", ffmpegCommand);

    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`FFmpeg error: ${error.message}`);
        return res.status(500).send("Error converting file");
      }
      console.log("File conversion successful");
    });
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = videoToAudioConverter;
