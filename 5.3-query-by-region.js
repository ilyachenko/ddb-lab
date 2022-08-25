import { ddb } from "./helpers/index.js";

async function getItem() {
  const params = {
    TableName: "Movies",
    IndexName: "TypesRegionIndex",
    KeyConditionExpression: "type = :type AND region = :region",
    ExpressionAttributeValues: {
      ":type": { S: "akas" },
      ":region": { S: "DE" },
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
