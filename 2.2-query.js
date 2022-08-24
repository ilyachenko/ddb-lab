import { ddb } from "./helpers/index.js";

async function getItem() {
  const params = {
    TableName: "Movies",
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
// 1: Get by id
// const params = {
//   TableName: "Movies",
//   KeyConditionExpression: "tconst = :tconst",
//   ExpressionAttributeValues: {
//     ":tconst": { S: "tt12374656" },
//   },
// };
////////////////////////////////////////////////////////////////////////////////
// 2: Projection
// ProjectionExpression: "primaryTitle, isAdult",
////////////////////////////////////////////////////////////////////////////////
// 3: Error handling - Query condition missed key schema element
// const params = {
//   TableName: "Movies",
//   KeyConditionExpression: "primaryTitle = :primaryTitle",
//   ExpressionAttributeValues: {
//     ":primaryTitle": { S: "Into Her Own" },
//   },
// };
////////////////////////////////////////////////////////////////////////////////
