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
import log from "./helpers/log.js";

const ddb = new AWS.DynamoDB({
  endpoint: "http://localhost:8000",
  region: "local",
});

function seedRatings() {
  const filePath = path.join(
    currDir(import.meta.url) + "/data/title.ratings.tsv"
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
    const { tconst, averageRating, numVotes } = d3
      .tsvParse(strToParse)
      .filter((d, i) => i !== "columns")[0];

    const params = {};

    try {
      log(counter, seedCounter);
      await ddb
        .updateItem(params)
        .promise()
        .then(() => log(counter, ++seedCounter));
    } catch (error) {
      console.log(error);
      console.log(params);
      process.exit(1);
    }
  });
}

seedRatings();

////////////////////////////////////////////////////////////////////////////////
// 1. Seed ratings
// {
//   TableName: "Movies",
//   Key: {
//     tconst: {
//       S: tconst,
//     },
//   },
//   UpdateExpression:
//     "set averageRating = :averageRating, numVotes = :numVotes",
//   ExpressionAttributeValues: {
//     ":averageRating": {
//       N: averageRating,
//     },
//     ":numVotes": {
//       N: numVotes,
//     },
//   },
// };
////////////////////////////////////////////////////////////////////////////////
// 2. Add sk to ratings
// sk: {
//   S: "#MOVIE#",
// },
////////////////////////////////////////////////////////////////////////////////
