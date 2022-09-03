import { ddb, log, LineParser, LineReader } from "./helpers/index.js";

const lineParser = new LineParser();

function seed() {
  let counter = 0;
  let seedCounter = 0;

  LineReader("director.basics", async (line) => {
    if (counter++ === 0) {
      lineParser.setColumn(line);
      return;
    }

    const {
      tconst,
      nconst,
      primaryName,
      birthYear,
      deathYear,
      primaryProfession,
    } = lineParser.parse(line);

    const params = {
      TableName: "Movies",
      Item: {
        tconst: {
          S: tconst,
        },
        sk: {
          S: `DIRECTOR#${nconst}`,
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
