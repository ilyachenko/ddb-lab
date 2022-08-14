/* 
Description:
  - Reads the file and gets the data from the file.
  - Writes the data to the file.
*/

// System libs
import { EOL } from "os";
import fs from "fs";
import path from "path";
import readline from "readline";

// TSV parser
import * as d3 from "d3-dsv";

// Helpers
import currDir from "./helpers/currDir.js";
import jetty from "./helpers/jetty.js";

const print = jetty();

const fileReadPath = path.join(
  currDir(import.meta.url) + "/data/title.basics.tsv"
);

const moviesWritePath = path.join(
  currDir(import.meta.url) + "/data/movies.tsv"
);

function getMoviesData() {
  let counter = -1;
  let columns;
  let moviesCounter = 0;

  var lineReader = readline.createInterface({
    input: fs.createReadStream(fileReadPath),
  });

  const moviesWriteStream = fs.createWriteStream(moviesWritePath, {
    encoding: "utf8",
  });

  lineReader.on("line", (line, index) => {
    counter++;
    if (counter === 0) {
      columns = line;
      moviesWriteStream.write(`${line}${EOL}`);
    }
    const strToParse = `${columns}${EOL}${line}`;
    const { titleType, startYear } = d3
      .tsvParse(strToParse)
      .filter((d, i) => i !== "columns")[0];
    if (
      startYear === "2022" &&
      (titleType === "movie" || titleType === "tvSeries")
    ) {
      moviesWriteStream.write(`${line}${EOL}`);
      print(
        `Movies and TV Shows 2022:\nSum: ${counter} \nThis year: ${moviesCounter++}`
      );
    }
  });
}

getMoviesData();
