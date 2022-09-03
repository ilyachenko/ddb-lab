import AWS from "aws-sdk";
import { ddb } from "./helpers/index.js";

async function getItem() {
  const params = {
    TableName: "Movies",
    Key: {
      tconst: { S: "tt7286456" },
      sk: { S: "MOVIE" },
    },
  };

  try {
    const results = await ddb.getItem(params).promise();
    console.log(results.Item);
    const unmarshaled = AWS.DynamoDB.Converter.unmarshall(results.Item);
    console.log(unmarshaled);
  } catch (error) {
    console.log(error);
  }
}

getItem();
