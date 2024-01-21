const path = require("path");
const fs = require("fs");
const readline = require("readline");
const { stdin, exit } = process;

const pathFile = path.join(__dirname, "text.txt");

const input = readline.createInterface(stdin);
const output = fs.createWriteStream(pathFile);

console.log("Enter your text: \n");

const handleExit = () => {
  console.log("Thank you!")
  exit();
}

input.on('line', (inputText) => {
  if (inputText === "exit") {
    handleExit();
  }
  output.write(`${inputText} `);
});

process.on("SIGINT", handleExit);