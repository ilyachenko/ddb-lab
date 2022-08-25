// System libs
import fs from "fs";
import path from "path";
import readline from "readline";

// Helpers
import { ddb, currDir, log, LineParser } from "./helpers/index.js";

const lineParser = new LineParser();

function seed() {
  const filePath = path.join(currDir(import.meta.url) + "/data/title.akas.tsv");

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

    const { titleId, ordering, title, region, language, types } =
      lineParser.parse(line);

    if (types !== "imdbDisplay") {
      return;
    }

    const params = {
      TableName: "Movies",
      Item: {
        tconst: {
          S: titleId,
        },
        type: {
          S: "akas",
        },
        sk: {
          S: `#AKAS#${titleId}#${ordering}`,
        },
        title: {
          S: title,
        },
        region: {
          S: region,
        },
        language: {
          S: language,
        },
      },
      ReturnConsumedCapacity: "TOTAL",
    };

    if (region === "\\N") {
      delete params.Item.region;
    }

    if (language === "\\N") {
      delete params.Item.language;
    }

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
