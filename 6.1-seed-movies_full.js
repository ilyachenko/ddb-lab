// System libs
import fs from "fs";
import path from "path";
import readline from "readline";

// Helpers
import { ddb, currDir, logWithTimer, LineParser } from "./helpers/index.js";

const lineParser = new LineParser();

function seed() {
  const filePath = path.join(currDir(import.meta.url) + "/data/title.full.tsv");

  const before = Date.now();
  let counter = 0;
  let seedCounter = 0;
  let columns;

  var lineReader = readline.createInterface({
    input: fs.createReadStream(filePath),
  });

  lineReader.on("line", async (line) => {
    if (counter++ === 0) {
      lineParser.setColumn(line);
      return;
    }

    const { tconst, originalTitle, runtimeMinutes, genres, startYear } =
      lineParser.parse(line);

    const params = {
      TableName: "MoviesFull",
      Item: {
        tconst: {
          S: tconst,
        },
        sk: {
          S: "#MOVIE#",
        },
        originalTitle: {
          S: originalTitle,
        },
        startYear: {
          N: startYear,
        },
        runtimeMinutes: {
          N: runtimeMinutes,
        },
        genres: {
          SS: genres.split(","),
        },
      },
      ReturnConsumedCapacity: "TOTAL",
    };

    if (genres === "\\N") {
      delete params.Item.genres;
    }

    if (runtimeMinutes === "\\N") {
      delete params.Item.runtimeMinutes;
    }

    try {
      logWithTimer(counter, seedCounter, before);
      await ddb
        .putItem(params)
        .promise()
        .then(() => logWithTimer(counter, ++seedCounter, before));
    } catch (error) {
      console.log(error);
      console.log(params);
      process.exit(1);
    }
  });
}

seed();
