import { ddb } from "./helpers/index.js";

const params = {
  TableName: "Movies",
};

ddb.updateTable(params, (err, data) => {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Table created successfully!");
  }
});
