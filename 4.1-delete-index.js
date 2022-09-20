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
      Delete: {
        IndexName: "MovieRatingIndex",
      },
    },
  ],
};

ddb.updateTable(params, (err, data) => {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Index deleted successfully!");
  }
});
