/*
Description:
    
*/

import AWS from "aws-sdk";

const ddb = new AWS.DynamoDB({
  endpoint: "http://localhost:8000",
  region: "local",
});

async function getItem() {
  const params = {
    TableName: "Movies",
    Key: {
      tconst: { S: "tt17220590" },
    },
  };

  try {
    const item = await ddb.getItem(params).promise();
    console.log(item.Item);
    const unmarshalled = AWS.DynamoDB.Converter.unmarshall(item.Item);
    console.log(unmarshalled);
  } catch (error) {
    console.log(error);
  }
}

getItem();
