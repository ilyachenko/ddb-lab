import { ddb } from "./helpers/index.js";

async function getItem() {
  const params = {
    TableName: "Movies",
  };

  try {
    const results = await ddb.scan(params).promise();
    console.log(results.Items.length);
  } catch (error) {
    console.log(error);
  }
}

getItem();
