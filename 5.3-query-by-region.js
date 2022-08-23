import AWS from "aws-sdk";

const ddb = new AWS.DynamoDB({
  endpoint: "http://localhost:8000",
  region: "local",
});

async function getItem() {
  const params = {
    TableName: "Movies",
    IndexName: "TypesRegionIndex",
    KeyConditionExpression: "#type = :type AND #region = :region",
    // FilterExpression: "#language = :language",
    ExpressionAttributeValues: {
      ":type": { S: "akas" },
      ":region": { S: "UA" },
      // ":language": { S: "de" },
    },
    ExpressionAttributeNames: {
      "#type": "type",
      "#region": "region",
      "#language": "language",
    },
    ProjectionExpression: "title, #language, #region",
  };

  try {
    const results = await ddb.query(params).promise();
    console.log(results.Items);
  } catch (error) {
    console.log(error);
  }
}

getItem();

// TODO mention about FilterExpression
// ProjectionExpression: "#region ,#language",
