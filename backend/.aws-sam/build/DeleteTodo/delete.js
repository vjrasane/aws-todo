const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const docClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION })
);

const handler = async (event) => {
  const id = event.pathParameters?.id;
  if (!id) return { statusCode: 400, body: "Missing id in path" };

  await docClient.send(
    new DeleteCommand({
      TableName: process.env.TODO_TABLE,
      Key: { id },
    })
  );

  return { statusCode: 204 };
};

module.exports = { handler };