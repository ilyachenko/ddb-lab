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
      Create: {
        IndexName: "TypesRegionIndex",
        KeySchema: [
          {
            AttributeName: "type",
            KeyType: "HASH",
          },
          {
            AttributeName: "region",
            KeyType: "RANGE",
          },
        ],
        Projection: {
          NonKeyAttributes: [],
          ProjectionType: "ALL",
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
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

// 1. ProjectionType: "KEYS_ONLY"
// 2. ProjectionType: "INCLUDE"
