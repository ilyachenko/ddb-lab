import { ddb } from "./helpers/index.js";

async function getItem() {
  const params = {
    TableName: "Movies",
  };

  try {
    const results = await ddb.query(params).promise();
    console.log(results.Items);
  } catch (error) {
    console.log(error);
  }
}

getItem();
