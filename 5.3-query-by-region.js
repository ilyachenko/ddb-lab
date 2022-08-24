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

////////////////////////////////////////////////////////////////////////////////
// 1. Reserved word error
// ExpressionAttributeNames: {
//   "#type": "type",
//   "#region": "region",
//   "#language": "language",
// },
// ProjectionExpression: "title, #region, #language",
// 2. DE region and de language
// FilterExpression: "#language = :language"
// ":language": { S: "de" }
////////////////////////////////////////////////////////////////////////////////
