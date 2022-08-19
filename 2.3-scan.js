import AWS from "aws-sdk";

const ddb = new AWS.DynamoDB({
  endpoint: "http://localhost:8000",
  region: "local",
});

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

// 1: Get count of items in table
// const params = {
//   TableName: "Movies",
// };

// 2: Get item by hash key
// const params = {
//   TableName: "Movies",
//   FilterExpression: "tconst = :tconst",
//   ExpressionAttributeValues: {
//     ":tconst": { S: "tt12374656" },
//   },
// };

// 3: Filter items by attribute value
// const params = {
//   TableName: "Movies",
//   FilterExpression: "isAdult = :isAdult",
//   ExpressionAttributeValues: {
//     ":isAdult": { BOOL: true },
//   },
// };

// SLIDE: Conditions
// 4: Filter by contains
// const params = {
//   TableName: "Movies",
//   FilterExpression: "contains(genres, :genres)",
//   ExpressionAttributeValues: {
//     ":genres": { S: "Drama" },
//   },
// };

// 5: Delete items without rating
