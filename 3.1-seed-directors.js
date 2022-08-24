/*
Description:
    - Reads the file and gets the data from the file.
    - Writes the data to the file.
    - Seeds the table.
*/

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

const print = jetty();

const ddb = new AWS.DynamoDB({
  endpoint: "http://localhost:8000",
  region: "local",
});

function updateStatus(counter, seedCounter) {
  const queue = counter - seedCounter > -1 ? counter - seedCounter - 1 : 0;
  print(`Queue: ${queue}\nAdded: ${seedCounter++}`);
}

function seed() {
  const filePath = path.join(
    currDir(import.meta.url) + "/data/director.basics.tsv"
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
    const {
      tconst,
      nconst,
      primaryName,
      birthYear,
      deathYear,
      primaryProfession,
    } = d3.tsvParse(strToParse).filter((d, i) => i !== "columns")[0];

    const params = {
      TableName: "Movies",
      Item: {
        tconst: {
          S: tconst,
        },
        sk: {
          S: `#DIRECTOR#${nconst}`,
        },
        primaryName: {
          S: primaryName,
        },
        birthYear: {
          N: birthYear,
        },
        deathYear: {
          N: deathYear,
        },
        primaryProfession: {
          SS: primaryProfession.split(","),
        },
      },
      ReturnConsumedCapacity: "TOTAL",
    };

    if (birthYear === "\\N") {
      delete params.Item.birthYear;
    }

    if (deathYear === "\\N") {
      delete params.Item.deathYear;
    }

    try {
      updateStatus(counter, seedCounter);
      await ddb
        .putItem(params)
        .promise()
        .then(() => updateStatus(counter, ++seedCounter));
    } catch (error) {
      console.log(error);
      console.log(params);
      process.exit(1);
    }
  });
}

seed();