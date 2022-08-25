import { ddb } from "./helpers/index.js";

async function getItem() {
  const params = {
    TableName: "Movies",
  };

  try {
    const results = await ddb.getItem(params).promise();
    console.log(results.Item);
  } catch (error) {
    console.log(error);
  }
}

getItem();
