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
import currDir from "./helpers/currDir.js";
import jetty from "./helpers/jetty.js";

const BATCH_SIZE = 25;

const print = jetty();

const ddb = new AWS.DynamoDB({
  endpoint: "http://localhost:8000",
  region: "local",
});

function updateStatus(counter, seedCounter, before) {
  const queue = counter - seedCounter > -1 ? counter - seedCounter - 1 : 0;
  print(
    `Queue: ${queue}\nAdded: ${seedCounter++}\nSeconds: ${
      (Date.now() - before) / 1000
    }`
  );
}

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
        updateStatus(counter, seedCounter * BATCH_SIZE, before);
        return await ddb
          .batchWriteItem(paramsToSend)
          .promise()
          .then(() =>
            updateStatus(counter, ++seedCounter * BATCH_SIZE, before)
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
