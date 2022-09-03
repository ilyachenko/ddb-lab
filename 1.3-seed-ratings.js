import { ddb, log, LineParser, LineReader } from "./helpers/index.js";

const lineParser = new LineParser();

function seedRatings() {
  let counter = 0;
  let seedCounter = 0;

  LineReader("title.ratings", async (line) => {
    if (counter++ === 0) {
      lineParser.setColumn(line);
      return;
    }

    const { tconst, averageRating, numVotes } = lineParser.parse(line);

    const params = {
      TableName: "Movies",
      Key: {
        tconst: {
          S: tconst,
        },
        sk: {
          S: "MOVIE",
        },
      },
      UpdateExpression:
        "set averageRating = :averageRating, numVotes = :numVotes",
      ExpressionAttributeValues: {
        ":averageRating": {
          N: averageRating,
        },
        ":numVotes": {
          N: numVotes,
        },
      },
    };

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
