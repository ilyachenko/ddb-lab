import { ddb, logWithTimer, LineParser, LineReader } from "./helpers/index.js";

const lineParser = new LineParser();

const BATCH_SIZE = 25;

async function seed() {
  const before = Date.now();
  let counter = 0;
  let seedCounter = 0;

  const params = {
    RequestItems: {
      MoviesFull: [],
    },
  };

  LineReader("title.full", async (line) => {
    if (counter++ === 0) {
      lineParser.setColumn(line);
      return;
    }

    const { tconst, originalTitle, runtimeMinutes, genres, startYear } =
      lineParser.parse(line);

    const Item = {
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
