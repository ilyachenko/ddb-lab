/* 
Description:
  - Creates a table in DynamoDB.
*/

import AWS from "aws-sdk";

const ddb = new AWS.DynamoDB({
  endpoint: "http://localhost:8000",
  region: "local",
});

const params = {
  TableName: "Movies",
  AttributeDefinitions: [
    {
      AttributeName: "type",
      AttributeType: "S",
    },
    {
      AttributeName: "region",
      AttributeType: "S",
    },
    {
      AttributeName: "language",
      AttributeType: "S",
    },
  ],
  GlobalSecondaryIndexUpdates: [
    {
      Delete: {
        IndexName: "TypesRegionIndex",
      },
    },
  ],
};

ddb.updateTable(params, (err, data) => {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Done!");
  }
});
