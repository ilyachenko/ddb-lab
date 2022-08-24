import { ddb } from "./helpers/index.js";

async function getItem() {
  const params = {
    TableName: "Movies",
    KeyConditionExpression: "tconst = :tconst AND begins_with(sk, :sk)",
    ExpressionAttributeValues: {
      ":tconst": { S: "tt4633694" },
      ":sk": { S: "#DIRECTOR#" },
    },
    ProjectionExpression: "primaryName",
  };

  try {
    const results = await ddb.query(params).promise();
    console.log(results.Items);
  } catch (error) {
    console.log(error);
  }
}

getItem();
