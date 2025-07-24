// src/update.js
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const docClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION })
);

const handler = async (event) => {
  const id = event.pathParameters?.id;
  if (!id) return { statusCode: 400, body: "Missing id in path" };

  const { text, done } = JSON.parse(event.body ?? "{}");

  const expressions = [];
  const names = {};
  const values = {};

  if (text !== undefined) {
    expressions.push("#t = :text");
    names["#t"] = "text";
    values[":text"] = text;
  }
  if (done !== undefined) {
    expressions.push("#d = :done");
    names["#d"] = "done";
    values[":done"] = done;
  }
  if (expressions.length === 0) {
    return { statusCode: 400, body: "Nothing to update" };
  }

  await docClient.send(
    new UpdateCommand({
      TableName: process.env.TODO_TABLE,
      Key: { id },
      UpdateExpression: `SET ${expressions.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );

  return { statusCode: 204 };
};

module.exports = { handler };
