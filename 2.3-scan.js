import { ddb } from "./helpers/index.js";

async function getItem() {
  const params = {
    TableName: "Movies",
  };

  try {
    const results = await ddb.scan(params).promise();
    console.log(results.Items.length);
  } catch (error) {
    console.log(error);
  }
}

getItem();

////////////////////////////////////////////////////////////////////////////////
// 1: Get count of items in table
// const params = {
//   TableName: "Movies",
// };
////////////////////////////////////////////////////////////////////////////////
// 2: Get item by hash key
// const params = {
//   TableName: "Movies",
//   FilterExpression: "tconst = :tconst",
//   ExpressionAttributeValues: {
//     ":tconst": { S: "tt12374656" },
//   },
// };
////////////////////////////////////////////////////////////////////////////////
// 3: Filter items by attribute value
// const params = {
//   TableName: "Movies",
//   FilterExpression: "isAdult = :isAdult",
//   ExpressionAttributeValues: {
//     ":isAdult": { BOOL: true },
//   },
// };
////////////////////////////////////////////////////////////////////////////////
// !!! SLIDE: Conditions !!!
// 4. Runtime less than
// const params = {
//   TableName: "Movies",
//   FilterExpression: "runtimeMinutes > :runtimeMinutes",
//   ExpressionAttributeValues: {
//     ":runtimeMinutes": { N: "0" },
//   },
// };
////////////////////////////////////////////////////////////////////////////////
// 5: Filter by contains
// const params = {
//   TableName: "Movies",
//   FilterExpression: "contains(genres, :genres)",
//   ExpressionAttributeValues: {
//     ":genres": { S: "Drama" },
//   },
// };
////////////////////////////////////////////////////////////////////////////////
