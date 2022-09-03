import { ddb, log, LineParser, LineReader } from "./helpers/index.js";

const lineParser = new LineParser();

function seed() {
  let counter = 0;
  let seedCounter = 0;

  LineReader("title.basics", async (line) => {
    if (counter++ === 0) {
      lineParser.setColumn(line);
      return;
    }

    const { tconst, originalTitle, runtimeMinutes, genres, startYear } =
      lineParser.parse(line);

    console.log(tconst, originalTitle, runtimeMinutes, genres, startYear);

    const params = {
      TableName: "Movies",
      Item: {
        tconst: {
          S: tconst,
        },
        sk: {
          S: "MOVIE#",
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
