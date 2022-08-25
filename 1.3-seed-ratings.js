// System libs
import fs from "fs";
import path from "path";
import readline from "readline";

// Helpers
import { ddb, currDir, log, LineParser } from "./helpers/index.js";

const lineParser = new LineParser();

function seedRatings() {
  const filePath = path.join(
    currDir(import.meta.url) + "/data/title.ratings.tsv"
  );

  let counter = 0;
  let seedCounter = 0;

  var lineReader = readline.createInterface({
    input: fs.createReadStream(filePath),
  });

  lineReader.on("line", async (line) => {
    if (counter++ === 0) {
      lineParser.setColumn(line);
      return;
    }

    const { tconst, averageRating, numVotes } = lineParser.parse(line);

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
