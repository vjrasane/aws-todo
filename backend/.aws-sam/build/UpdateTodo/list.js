const { DynamoDBClient } =require( "@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require( "@aws-sdk/lib-dynamodb");

const docClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION })
);

const handler = async () => {
  const { Items = [] } = await docClient.send(
    new ScanCommand({
      TableName: process.env.TODO_TABLE,
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify(
      Items.map((i) => ({
        id: i.id,
        text: i.text,
        done: i.done,
      }))
    ),
  };
};

module.exports = { handler };