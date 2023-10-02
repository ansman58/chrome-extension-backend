require("dotenv").config();
const fs = require("fs");
const { Deepgram } = require("@deepgram/sdk");
const Video = require("../models/videoModel");

const audioTranscriber = async (req, res, next) => {
  // Your Deepgram API Key
  const deepgramApiKey = process.env.DEEPGRAM_API_KEY;

  try {
    const videoId = req.params.videoId;
    if (!videoId) {
      return res.status(400).send("Please a video ID");
    }

    const video = await Video.findByPk(videoId);

    if (!video) {
      return res
        .status(404)
        .send("Video not found. Please provide a valid video ID");
    }

    const file = video.audioFilePath;

    // Mimetype for the file you want to transcribe
    const mimetype = "audio/mp3";

    // Initialize the Deepgram SDK
    const deepgram = new Deepgram(deepgramApiKey);

    let source;

    // Check whether requested file is local or remote, and prepare accordingly
    if (file.startsWith("http")) {
      // File is remote
      source = {
        url: file,
      };
    } else {
      // File is local
      const audio = fs.readFileSync(file);
      source = {
        buffer: audio,
        mimetype: mimetype,
      };
    }

    const getVideo = await Video.findByPk(videoId);

    if (getVideo.transcription) {
      console.log("already existtsss");
      console.log(getVideo.transcription);
    }

    // Send the audio to Deepgram and get the response

    if (!getVideo.transcription) {
      console.log("still got calledddddd");

      const response = await deepgram.transcription.preRecorded(source, {
        smart_format: true,
        model: "nova",
      });

      // Write the transcript to the console
      console.log("Transcription successful:");

      const transcriptions =
        response.results.channels[0].alternatives[0].transcript;
      const words = response.results.channels[0].alternatives[0].words;

      console.log(transcriptions);

      await Video.update(
        {
          transcription: JSON.stringify({
            transcriptionInString: transcriptions,
            transcriptionWithTimestamps: words,
          }),
        },
        {
          where: {
            id: videoId,
          },
        }
      );
    }

    next();
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).send("An error occurred during transcription");
  }
};

module.exports = audioTranscriber;
