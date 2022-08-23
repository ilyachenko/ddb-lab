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
    const results = await ddb.query(params).promise();
    console.log(results.Items);
  } catch (error) {
    console.log(error);
  }
}

getItem();

// 1: Get by id
// const params = {
//   TableName: "Movies",
//   KeyConditionExpression: "tconst = :tconst",
//   ExpressionAttributeValues: {
//     ":tconst": { S: "tt12374656" },
//   },
// };

// 2: Projection
// ProjectionExpression: "primaryTitle, isAdult",

// 3: Demo error handling - Query condition missed key schema element
// const params = {
//   TableName: "Movies",
//   KeyConditionExpression: "primaryTitle = :primaryTitle",
//   ExpressionAttributeValues: {
//     ":primaryTitle": { S: "Into Her Own" },
//   },
// };
