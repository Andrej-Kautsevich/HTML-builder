const path = require("path");
const fs = require("fs");
const { stdout } = process;

const pathFolder = path.join(__dirname, "secret-folder");

fs.readdir(
  pathFolder,
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err.message);
    files.forEach((file) => {
      const pathFile = path.join(file.path, file.name);

      fs.stat(
        pathFile,
        (err, stats) => {
          if (err) console.log(err.message);
          if (stats.isFile()) {
            const fileName = path.parse(pathFile).name;
            const fileExt = path.parse(pathFile).ext.slice(1);
            const fileSize = stats.size;
            stdout.write(`${fileName} - ${fileExt} - ${(fileSize / 1024).toFixed(3)}kb\n`)
          }
        }
      )
    })
  }
);