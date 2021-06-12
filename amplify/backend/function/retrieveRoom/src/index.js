/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageRoomStorageName = process.env.STORAGE_ROOMSTORAGE_NAME
var storageRoomStorageArn = process.env.STORAGE_ROOMSTORAGE_ARN
var functionGenerateLettersName = process.env.FUNCTION_GENERATELETTERS_NAME

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
} = require('@aws-sdk/lib-dynamodb');

const region = process.env.REGION;
AWS.config.update({ region });

const storageRoomStorageName = process.env.STORAGE_ROOMSTORAGE_NAME;
const db = new DynamoDBClient({ region });
const ddb = DynamoDBDocumentClient.from(db);
const ddbTableName = storageRoomStorageName;

const lambda = new AWS.Lambda({ region });

/**
 * Finds a game room and returns that room's information for a given room code.
 * If a room does not exist at that room code, creates a new room.
 * @param {Object} event
 * @param {Object} event.arguments
 * @param {String} event.arguments.roomCode Four-letter code for the desired room
 * @returns {Object} Room data
 */
exports.handler = async event => {
	const { roomCode } = event.arguments;

	if (!roomCode) {
		throw new Error('Room not found or invalid.');
	}

	const params = {
		TableName: ddbTableName,
		Key: {
			roomCode,
		},
	};

	let room;
	try {
		({ Item: room } = await ddb.send(new GetCommand(params)));
	} catch (err) {
		throw new Error(`Room retrieval error: ${err}`);
	}

	if (!room || !room.letters) {
		room = await createRoom(event);
	}

	return room;
};

/**
 * Makes an entirely new game room.
 * @param {Object} event
 * @param {Object} event.arguments
 * @param {String} event.arguments.roomCode Four-letter code for the desired room
 * @returns {Object} Room with newly-generated letters
 */
async function createRoom(event) {
	const { roomCode } = event.arguments;

	const response = await lambda
		.invoke({
			FunctionName: process.env.FUNCTION_GENERATELETTERS_NAME,
			Payload: JSON.stringify(event, null, 2),
		})
		.promise();

	const generatedLetters = JSON.parse(response.Payload);

	const params = {
		TableName: ddbTableName,
		Item: {
			foundWords: [],
			letters: generatedLetters,
			roomCode
		},
		Key: {
			roomCode,
		},
	};

	try {
		await ddb.send(new PutCommand(params));
		// put can't return the room it just saved, so we need to go get it
		const { Item: room } = ddb.send(new GetCommand(params));
		return room;
	} catch (err) {
		throw new Error(`Room creation error: ${err}`);
	}
}
