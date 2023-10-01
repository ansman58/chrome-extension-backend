const express = require("express");
const upload = require("./src/services/multer");
const videoRoutes = require("./src/routes/videos");
const diskRoutes = require("./src/routes/diskStorage");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use("/video", upload.single("file"), videoRoutes);
app.use("/disk", diskRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Listening on port http://localhost:3000");
});
