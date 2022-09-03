import { ddb } from "./helpers/index.js";

const params = {
  TableName: "Movies",
  KeySchema: [
    {
      AttributeName: "tconst",
      KeyType: "HASH",
    },
    {
      AttributeName: "sk",
      KeyType: "RANGE",
    },
  ],
  AttributeDefinitions: [
    {
      AttributeName: "tconst",
      AttributeType: "S",
    },
    {
      AttributeName: "sk",
      AttributeType: "S",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  StreamSpecification: {
    StreamEnabled: false,
  },
};

ddb.createTable(params, (err, data) => {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Table created successfully!");
  }
});
