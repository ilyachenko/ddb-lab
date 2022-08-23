import AWS from "aws-sdk";

const ddb = new AWS.DynamoDB({
  endpoint: "http://localhost:8000",
  region: "local",
});

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
