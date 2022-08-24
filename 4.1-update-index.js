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
      AttributeName: "sk",
      AttributeType: "S",
    },
    {
      AttributeName: "averageRating",
      AttributeType: "N",
    },
  ],
  GlobalSecondaryIndexUpdates: [
    {
      Create: {
        IndexName: "MovieRatingIndex",
        KeySchema: [
          {
            AttributeName: "sk",
            KeyType: "HASH",
          },
          {
            AttributeName: "averageRating",
            KeyType: "RANGE",
          },
        ],
        Projection: {
          NonKeyAttributes: ["originalTitle"],
          ProjectionType: "INCLUDE",
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
    console.log("Table created successfully!");
  }
});