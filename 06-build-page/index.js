const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;

const pathTemplateFile = path.join(__dirname, "template.html");
const pathComponents = path.join(__dirname, "components");
const pathStyles = path.join(__dirname, "styles");
const pathAssets = path.join(__dirname, "assets");

const pathProjectDist = path.join(__dirname, "project-dist");
const pathProjectDistAssets = path.join(pathProjectDist, "assets");
const pathHtmlFile = path.join(pathProjectDist, "index.html");
const pathCSSFile = path.join(pathProjectDist, "style.css");

fsPromises.mkdir(
  pathProjectDist,
  { recursive: true },
).then(() => {
  bundleHTML();
  bundleCSS();
  copyAssets(pathAssets, pathProjectDistAssets);
})

const bundleHTML = () => {
  fsPromises.readFile(pathTemplateFile, "utf8").then((template) => {
    fsPromises.readdir(pathComponents, { withFileTypes: true }).then((files) => {
      const promises = files.map((component) => {
        const nameComponent = path.parse(component.name).name;
        const pathFileComponent = path.join(pathComponents, component.name);

        return fsPromises.readFile(pathFileComponent, "utf8").then((file) => {
          template = template.replaceAll(`{{${nameComponent}}}`, file)
        })
      })
      Promise.all(promises).then(() => {
        fsPromises.writeFile(pathHtmlFile, template);
      })
    })
  })
}

const bundleCSS = () => {
  fsPromises.readdir(
    pathStyles,
    { withFileTypes: true },
  ).then((files) => {
    const writeStream = fs.createWriteStream(pathCSSFile);

    files.forEach((file) => {
      const pathFile = path.join(pathStyles, file.name);
      if (file.isFile() && path.parse(pathFile).ext === ".css") {
        const readStream = fs.createReadStream(pathFile, "utf-8");
        readStream.pipe(writeStream);
      }
    })
  })
}

const copyAssets = (source, dest) => {
  fsPromises.mkdir(
    dest,
    { recursive: true }
  ).then(() => {
    fsPromises.readdir(
      source,
      { withFileTypes: true }
    ).then((files) => {
      files.forEach((file) => {
        const pathFile = path.join(source, file.name);
        const pathFileCopy = path.join(dest, file.name);

        file.isDirectory()
          ? copyAssets(pathFile, pathFileCopy)
          : fsPromises.copyFile(
            pathFile,
            pathFileCopy
          )
      })
    })
  })
}