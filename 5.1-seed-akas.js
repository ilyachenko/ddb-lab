import { ddb, log, LineParser, LineReader } from "./helpers/index.js";

const lineParser = new LineParser();

function seed() {
  let counter = 0;
  let seedCounter = 0;

  LineReader("title.akas", async (line) => {
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
          S: `AKAS#${titleId}#${ordering}`,
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
