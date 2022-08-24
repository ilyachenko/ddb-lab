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
      Item: {},
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
// 1. Seed directors data
// tconst: {
//   S: tconst,
// },
// sk: {
//   S: `#DIRECTOR#${nconst}`,
// },
// primaryName: {
//   S: primaryName,
// },
// birthYear: {
//   N: birthYear,
// },
// deathYear: {
//   N: deathYear,
// },
// primaryProfession: {
//   SS: primaryProfession.split(","),
// },
//
// if (birthYear === "\\N") {
//   delete params.Item.birthYear;
// }
//
// if (deathYear === "\\N") {
//   delete params.Item.deathYear;
// }
////////////////////////////////////////////////////////////////////////////////
