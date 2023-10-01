const express = require("express");
const upload = require("./src/services/multer");
const fs = require("fs");
const path = require("path");
const videoRoutes = require("./src/routes/videos");

const app = express();

const templateString = fs.readFileSync(path.join(__dirname, "views", "index.ejs"), 'utf-8');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use("/video", upload.single("file"), videoRoutes);

app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, "index.html"));
  res.end(ejs.render(templateString));
});

app.listen(3000, () => {
  console.log("Listening on port http://localhost:3000");
});
