import { ddb } from "./helpers/index.js";

const params = {
  TableName: "Movies",
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

////////////////////////////////////////////////////////////////////////////////
// 1. Create table
// KeySchema: [
//   {
//     AttributeName: "tconst",
//     KeyType: "HASH",
//   },
// ],
// AttributeDefinitions: [
//   {
//     AttributeName: "tconst",
//     AttributeType: "S",
//   },
// ]
////////////////////////////////////////////////////////////////////////////////
// 2. Re-create table with sort key
// {
//   AttributeName: "sk",
//   KeyType: "RANGE",
// }
////////////////////////////////////////////////////////////////////////////////
