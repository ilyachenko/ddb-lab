import readline from "readline";
import fs from "fs";
import path from "path";
import currDir from "./currDir.js";

export default function LineReader(fileName, cb) {
  const filePath = path.join(
    currDir(import.meta.url) + `/../data/${fileName}.tsv`
  );

  var lineReader = readline.createInterface({
    input: fs.createReadStream(filePath),
  });

  lineReader.on("line", async (line) => cb(line));
}
