const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;

const pathSource = path.join(__dirname, "files");
const pathCopy = path.join(__dirname, "files-copy");

fsPromises.mkdir(
  pathCopy,
  { recursive: true },
)

fs.readdir(
  pathSource,
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err.message);
    files.forEach((file) => {
      const pathFile = path.join(pathSource, file.name);
      const pathFileCopy = path.join(pathCopy, file.name);
      fsPromises.copyFile(
        pathFile,
        pathFileCopy
      )
    })
  }
)