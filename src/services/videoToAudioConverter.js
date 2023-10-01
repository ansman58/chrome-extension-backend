const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const audioTranscriber = require("./audioTranscriber");

function videoToAudioConverter(req, res, next) {
  const targetDirectory = "public";
  const uploadSubdirectory = "public/audios";
  const inputFile = req.file.path;

  const inputFileNameWithoutExtension = path.basename(
    inputFile,
    path.extname(inputFile)
  );

  const outputFile = path.join(
    uploadSubdirectory,
    inputFileNameWithoutExtension + ".mp3"
  );

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

        next();
      });
    }
  });
}

module.exports = videoToAudioConverter;
