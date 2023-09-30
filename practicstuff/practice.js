const fs = require("fs");
const zlib = require("zlib");
const http = require("http");

const fileToRead = fs.createReadStream("./file.txt", {
  encoding: "utf-8",
  highWaterMark: 2,
});

const fileToWriteTo = fs.createWriteStream("./file2.txt", "utf-8");

// fileToRead.on("data", (chunk) => {
//   console.log(chunk);
//   fileToWriteTo.write(chunk);
// });
// alternative to the above is to pipe

// const pipe = fileToRead.pipe(fileToWriteTo);

// console.log(pipe);

const gzib = zlib.createGzip();
fileToRead.pipe(gzib).pipe(fs.createWriteStream("./file.txt.gz"));
// const compressed = fs.createWriteStream("./file.txt.gz");
// console.log(compressed);

http.createServer((req, res) => {
  res.writeHead(200, { "content-encoding": "gzip" });
});
