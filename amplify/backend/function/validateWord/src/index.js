/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var functionRetrieveRoomName = process.env.FUNCTION_RETRIEVEROOM_NAME
var functionSaveWordName = process.env.FUNCTION_SAVEWORD_NAME

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');

const region = process.env.REGION;
AWS.config.update({ region });

const lambda = new AWS.Lambda({ region });

exports.handler = async event => {
	const { currentGuess } = event.arguments;

	const response = await lambda
		.invoke({
			FunctionName: process.env.FUNCTION_RETRIEVEROOM_NAME,
			Payload: JSON.stringify(event, null, 2),
		})
		.promise();

	const room = JSON.parse(response.Payload);

	const { letters, roomCode } = room;

	if (!letters) {
		throw new Error(`Valid letters for room ${roomCode} could not be found.`);
	}

	if (await isValidWord(currentGuess, letters)) {
		try {
			const response = await lambda
				.invoke({
					FunctionName: process.env.FUNCTION_SAVEWORD_NAME,
					Payload: JSON.stringify(event, null, 2),
				})
				.promise();

			return JSON.parse(response.Payload);
		} catch (err) {
			console.error(err);
			return 'ERROR';
		}
	}

	return 'INVALID_WORD';
};

async function isValidWord(word, letters) {
	// Make sure the word only contains letters from the room
	const lettersRegex = RegExp(`^[${letters.join('')}]+$`, 'i');
	const containsValidLetters = lettersRegex.test(word);

	if (containsValidLetters) {
		// Make sure the word is a valid English word.
		// Loading a full dictionary in this Lambda is computationally very expensive.
		// So, we rely on the external Datamuse API instead.
		// https://www.datamuse.com/api/
		//
		// We can confidently find a match by using the "spelled like" parameter
		// and limiting to one result. If that result's `word` matches the guessed word,
		// there's a good chance the user gave a valid English word.
		//
		// FIXME: This dictionary may include proper names and nouns.
		// How the heck did Jackbox solve word validation at scale? In TMP1, no less!
		const datamuse = require('datamuse');

		const result = await datamuse.words({ max: 1, sp: word });

		if (result[0]) {
			const resultRegEx = RegExp(`^${result[0].word}$`, 'i');
			return resultRegEx.test(word);
		}
	}

	return false;
}
