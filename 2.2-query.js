import { ddb } from "./helpers/index.js";

async function getItem() {
  const params = {
    TableName: "Movies",
    KeyConditionExpression: "tconst = :tconst",
    ExpressionAttributeValues: {
      ":tconst": { S: "tt7286456" },
    },
  };

  try {
    const results = await ddb.query(params).promise();
    console.log(results.Items);
  } catch (error) {
    console.log(error);
  }
}

getItem();

////////////////////////////////////////////////////////////////////////////////
// 1: Projection
// ProjectionExpression: "originalTitle, runtimeMinutes",
////////////////////////////////////////////////////////////////////////////////
// 2: Error handling - Query condition missed key schema element
// const params = {
//   TableName: "Movies",
//   KeyConditionExpression: "primaryTitle = :primaryTitle",
//   ExpressionAttributeValues: {
//     ":primaryTitle": { S: "Into Her Own" },
//   },
// };
////////////////////////////////////////////////////////////////////////////////
