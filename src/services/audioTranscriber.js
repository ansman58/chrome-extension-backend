require("dotenv").config();
const fs = require("fs");
const { Deepgram } = require("@deepgram/sdk");
const path = require("path");

const audioTranscriber = async (req, res) => {
  // Your Deepgram API Key
  const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
  // Location of the file you want to transcribe. Should include filename and extension.
  // Example of a local file: ../../Audio/life-moves-pretty-fast.wav
  // Example of a remote file: https://static.deepgram.com/examples/interview_speech-analytics.wav

  //   const videoId = req.params.videoId;
  const audioFilePath =
    path.basename(req.file.path, path.extname(req.file.path)) + ".mp3";

  //   const video = await VideoModel.findByPk(videoId);
  //   console.log("video from transcriber", video);
  console.log("audiooofile", audioFilePath);
  const file = audioFilePath;

  //   const file = "../public/audios/1696149645492-Malcolm X’s Fiery Speech Addressing Police Brutality.mp3";

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
    source = {
      url: file,
    };
  } else {
    // File is local
    // Open the audio file
    const audio = fs.readFileSync(file);

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
      return response.results.channels[0].alternatives[0].transcript;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = audioTranscriber;
