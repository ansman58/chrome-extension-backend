const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const VideoModel = require("../models/videoModel");

async function videoToAudioConverter(req, res, next) {
  const targetDirectory = "public";
  const uploadSubdirectory = "public/audios";

  const video = await VideoModel.findByPk(req.params.videoId);

  const inputFile = video.videoFilepath;

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
    return res.status(404).send("Error occured updating model");
  }

  if (!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory);
  }

  if (!fs.existsSync(uploadSubdirectory)) {
    fs.mkdirSync(uploadSubdirectory);
  }

  const ffmpegCommand = `ffmpeg -i "${inputFile}" "${outputFile}"`;

  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`FFmpeg error: ${error.message}`);
      return next(error);
    } else {
      console.log("File conversion successful");
      res.download(outputFile, (err) => {
        if (err) {
          console.error(`Download error: ${err.message}`);
          return next(err);
        }

        // Cleanup: Delete the input and output files (uncomment if needed)
        // fs.unlinkSync(inputFile);
        // fs.unlinkSync(outputFile);
      });
    }
  });
  next();
}

module.exports = videoToAudioConverter;
