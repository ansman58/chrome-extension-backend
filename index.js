const express = require("express");
const upload = require("./multer");
const fs = require("fs");
const path = require("path");
const router = require("./src/routes/videos");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("video", router);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => {
  console.log("Listening on port http://localhost:3000");
});
