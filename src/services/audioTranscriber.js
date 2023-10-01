require("dotenv").config();
const fs = require("fs");
const { Deepgram } = require("@deepgram/sdk");
const path = require("path");
const VideoModel = require("../models/videoModel");

const audioTranscriber = async (req, res, next) => {
  // Your Deepgram API Key
  const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
  // Location of the file you want to transcribe. Should include filename and extension.
  // Example of a local file: ../../Audio/life-moves-pretty-fast.wav
  // Example of a remote file: https://static.deepgram.com/examples/interview_speech-analytics.wav

  const videoId = req.params.videoId;

  const video = await VideoModel.findByPk(videoId);
  console.log("video", videoId);

  const file = video.audioFilePath;

  // Mimetype for the file you want to transcribe
  // Only necessary if transcribing a local file
  // Example: audio/wav
  const mimetype = "audio/mp3";

  // Initialize the Deepgram SDK
  const deepgram = new Deepgram(deepgramApiKey);

  // Check whether requested file is local or remote, and prepare accordingly
  if (file.startsWith("http")) {
    // File is remote
    // Set the source
    console.log("remmootee fille", file);

    source = {
      url: file,
    };
  } else {
    console.log("locall fille", file);
    // File is local
    // Open the audio file
    const audio = fs.readFileSync(file);
    // const audio = fs.createReadStream(file);
    console.log("localll audio", audio)

    // Set the source
    source = {
      buffer: audio,
      mimetype: mimetype,
    };
  }

  // Send the audio to Deepgram and get the response
  deepgram.transcription
    .preRecorded(source, {
      smart_format: true,
      model: "nova",
    })
    .then((response) => {
      // Write the response to the console
      //   console.dir(response, { depth: null });
      console.log("Transcription successfulllllll");

      // Write only the transcript to the console
      console.dir(response.results.channels[0].alternatives[0].transcript, {
        depth: null,
      });
      //   response.results.channels[0].alternatives[0].transcript;
      next();
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = audioTranscriber;
