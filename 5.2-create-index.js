import { ddb } from "./helpers/index.js";

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
