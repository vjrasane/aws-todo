const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const ddb = new DynamoDBClient({});
console.log('Using table:', process.env.TODO_TABLE, 'in region', process.env.AWS_REGION);
const handler = async (event) => {
    const body = JSON.parse(event.body ?? "{}");
    const id = Date.now().toString();

    const resp = await ddb.send(new PutItemCommand({
        TableName: process.env.TODO_TABLE,
        Item: {
            id: { S: id },
            text: { S: body.text ?? "" },
            done: { BOOL: false }
        },
        ReturnConsumedCapacity: "TOTAL"
    }));
    console.log("PutItem response →", JSON.stringify(resp));
    return { statusCode: 201, body: JSON.stringify({ id, text: body.text, done: false }) };
};

module.exports = { handler };
