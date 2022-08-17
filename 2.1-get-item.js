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
    const results = await ddb.getItem(params).promise();
    console.log(results.Item);
    const unmarshalled = AWS.DynamoDB.Converter.unmarshall(results.Items);
    console.log(unmarshalled);
  } catch (error) {
    console.log(error);
  }
}

getItem();
