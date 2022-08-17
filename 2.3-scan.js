import AWS from "aws-sdk";

const ddb = new AWS.DynamoDB({
  endpoint: "http://localhost:8000",
  region: "local",
});

async function getItem() {
  const params = {
    TableName: "Movies",
    // FilterExpression: "titleType = :titleType",
    // ExpressionAttributeValues: {
    //   ":titleType": { S: "movie" },
    // },
  };

  try {
    const results = await ddb.scan(params).promise();
    console.log(results.Items.length);
  } catch (error) {
    console.log(error);
  }
}

getItem();
