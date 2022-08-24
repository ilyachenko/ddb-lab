// System libs
import { EOL } from "os";
import fs from "fs";
import path from "path";
import readline from "readline";

// TSV parser
import * as d3 from "d3-dsv";

// Helpers
import { ddb, currDir, log } from "./helpers/index.js";

function seed() {
  const filePath = path.join(
    currDir(import.meta.url) + "/data/title.basics.tsv"
  );

  let counter = 0;
  let seedCounter = 0;
  let columns;

  var lineReader = readline.createInterface({
    input: fs.createReadStream(filePath),
  });

  lineReader.on("line", async (line) => {
    if (counter++ === 0) {
      columns = line;
      return;
    }
    const strToParse = `${columns}${EOL}${line}`;
    const { tconst, originalTitle, runtimeMinutes, genres, startYear } = d3
      .tsvParse(strToParse)
      .filter((d, i) => i !== "columns")[0];

    const params = {
      TableName: "Movies",
      ReturnConsumedCapacity: "TOTAL",
    };

    try {
      log(counter, seedCounter);
      await ddb
        .putItem(params)
        .promise()
        .then(() => log(counter, ++seedCounter));
    } catch (error) {
      console.log(error);
      console.log(params);
      process.exit(1);
    }
  });
}

seed();

////////////////////////////////////////////////////////////////////////////////
// 1. Seed the Movies table with the data from the title.basics.tsv file.
// Item: {
//   tconst: {
//     S: tconst,
//   },
//   originalTitle: {
//     S: originalTitle,
//   },
//   startYear: {
//     N: startYear,
//   },
//   runtimeMinutes: {
//     N: runtimeMinutes,
//   },
//   genres: {
//     SS: genres.split(","),
//   },
// },
//
// Remove 'N' symbol
// if (genres === "\\N") {
//   delete params.Item.genres;
// }
////////////////////////////////////////////////////////////////////////////////
// 2. Add a new column to the Movies table called "sk".
// sk: {
//   S: "#MOVIE#",
// },
////////////////////////////////////////////////////////////////////////////////
