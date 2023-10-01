const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

function videoToAudioConverter(req, res, next) {
  const dir = "public";
  const subDirectory = "public/uploads";
  const inputFile = req.file.path;
  const outputFile = path.join(subDirectory, "output.mp3");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  if (!fs.existsSync(subDirectory)) {
    fs.mkdirSync(subDirectory);
  }

  const ffmpegCommand = `ffmpeg -i "${inputFile}" "${outputFile}"`;

  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`FFmpeg error: ${error.message}`);
      return next(error);
    } else {
      console.log("File is converted successfully");
      res.download(outputFile, (err) => {
        if (err) {
          console.error(`Download error: ${err.message}`);
          return next(err);
        }

        // Cleanup: Delete the input and output files
        // fs.unlinkSync(inputFile);
        // fs.unlinkSync(outputFile);

        next();
      });
    }
  });
}

module.exports = videoToAudioConverter;
