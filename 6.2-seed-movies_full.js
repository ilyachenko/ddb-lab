// System libs
import { EOL } from "os";
import fs from "fs";
import path from "path";
import readline from "readline";

// AWS SDK
import AWS from "aws-sdk";

// TSV parser
import * as d3 from "d3-dsv";

// Helpers
import { ddb, currDir, logWithTimer } from "./helpers/index.js";

const BATCH_SIZE = 25;

async function seed() {
  const filePath = path.join(currDir(import.meta.url) + "/data/title.full.tsv");

  const before = Date.now();
  let counter = 0;
  let seedCounter = 0;
  let columns;
  let chunkCounter = 0;

  var lineReader = readline.createInterface({
    input: fs.createReadStream(filePath),
  });

  const params = {
    RequestItems: {
      MoviesFull: [],
    },
  };

  lineReader.on("line", async (line) => {
    if (counter++ === 0) {
      columns = line;
      return;
    }

    const strToParse = `${columns}${EOL}${line}`;
    const { tconst, originalTitle, runtimeMinutes, genres, startYear } = d3
      .tsvParse(strToParse)
      .filter((d, i) => i !== "columns")[0];

    const Item = {
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
    };

    if (genres === "\\N") {
      delete Item.genres;
    }

    if (runtimeMinutes === "\\N") {
      delete Item.runtimeMinutes;
    }

    params.RequestItems.MoviesFull.push({
      PutRequest: {
        Item,
      },
    });

    if (params.RequestItems.MoviesFull.length === BATCH_SIZE) {
      const paramsToSend = JSON.parse(JSON.stringify(params));
      params.RequestItems.MoviesFull = [];
      try {
        logWithTimer(counter, seedCounter * BATCH_SIZE, before);
        return await ddb
          .batchWriteItem(paramsToSend)
          .promise()
          .then(() =>
            logWithTimer(counter, ++seedCounter * BATCH_SIZE, before)
          );
      } catch (error) {
        console.log(error);
        console.log(paramsToSend.RequestItems.MoviesFull.length);
        process.exit(1);
      }
    }
  });
}

await seed();
