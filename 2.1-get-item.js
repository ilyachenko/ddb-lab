import AWS from "aws-sdk";

const ddb = new AWS.DynamoDB({
  endpoint: "http://localhost:8000",
  region: "local",
});

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

////////////////////////////////////////////////////////////////////////////////
// 1. Get by id
// Key: {
//   tconst: { S: "tt7286456" },
// },
////////////////////////////////////////////////////////////////////////////////
// 2. Show unmarshalled data
// AWS.DynamoDB.Converter.unmarshall(results.Item);
////////////////////////////////////////////////////////////////////////////////
