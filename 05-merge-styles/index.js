const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;

const pathFolder = path.join(__dirname, "styles");
const pathBundle = path.join(__dirname, "project-dist", "bundle.css");

fsPromises.readdir(
  pathFolder,
  { withFileTypes: true },
).then((files) => {
  const writeStream = fs.createWriteStream(pathBundle);

  files.forEach((file) => {
    const pathFile = path.join(pathFolder, file.name);
    if (file.isFile() && path.parse(pathFile).ext === ".css") {
      const readStream = fs.createReadStream(pathFile, "utf-8");
      readStream.pipe(writeStream);
    }
  })
})