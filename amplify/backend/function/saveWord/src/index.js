/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageRoomStorageName = process.env.STORAGE_ROOMSTORAGE_NAME
var storageRoomStorageArn = process.env.STORAGE_ROOMSTORAGE_ARN
var functionRetrieveRoomName = process.env.FUNCTION_RETRIEVEROOM_NAME

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');

const region = process.env.REGION;
AWS.config.update({ region });

const storageRoomStorageName = process.env.STORAGE_ROOMSTORAGE_NAME;
const ddb = new AWS.DynamoDB.DocumentClient();
const ddbTableName = storageRoomStorageName;

const lambda = new AWS.Lambda({ region });

/**
 * Saves a new word for a game room to the database.
 * Also indicates if a word is new, old, longest, or tied for longest.
 * @param {Object} event
 * @param {Object} event.arguments
 * @param {String} event.arguments.currentGuess Word submitted by the player
 * @param {String} event.arguments.playerName Non-unique identifier for the player
 * @throws Will throw when the database cannot be reached to store a new word.
 * @returns {String} Constant values indicating something about the input.
 *     (e.g. "OLD_WORD", "NEW_WORD", "LONGEST_WORD", and so on.)
 */
exports.handler = async event => {
	const { currentGuess, playerName } = event.arguments;

	const response = await lambda
		.invoke({
			FunctionName: process.env.FUNCTION_RETRIEVEROOM_NAME,
			Payload: JSON.stringify(event, null, 2),
		})
		.promise();

	const room = JSON.parse(response.Payload);

	const { foundWords, roomCode } = room;

	const words = foundWords.map(entry => {
		const { word } = JSON.parse(entry);
		return word;
	});

	if (words.includes(currentGuess)) {
		return 'OLD_WORD';
	}

	// Calculating the longest word of foundWords adds compute time to this Lambda.
	// The trade-off is it lets us store less data in the database.
	const longestWordLength = words.reduce(
		(acc, word) => (word.length > acc ? word.length : acc),
		0
	);
	const isLongestWord = currentGuess.length > longestWordLength;
	const isTiedWord = currentGuess.length === longestWordLength;

	foundWords.push(JSON.stringify({ playerName, word: currentGuess }));

	const params = {
		TableName: ddbTableName,
		UpdateExpression: 'set foundWords = :fw',
		ExpressionAttributeValues: {
			':fw': foundWords,
		},
		Key: {
			roomCode,
		},
	};

	try {
		await ddb.update(params).promise();
	} catch (err) {
		throw new Error(`Word save error: ${err}`);
	}

	if (isLongestWord) {
		return 'LONGEST_WORD';
	} else if (isTiedWord) {
		return 'TIED_WORD';
	}

	return 'NEW_WORD';
};
