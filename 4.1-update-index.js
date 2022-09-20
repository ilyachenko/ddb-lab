import { ddb } from "./helpers/index.js";

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
    console.log("Index created successfully!");
  }
});

////////////////////////////////////////////////////////////////////////////////
// 1. Re-create index KEYS_ONLY projection
////////////////////////////////////////////////////////////////////////////////
// 2. Re-create index INCLUDE projection
// Projection: {
//   NonKeyAttributes: ["startYear"],
//   ProjectionType: "INCLUDE",
// },
////////////////////////////////////////////////////////////////////////////////
