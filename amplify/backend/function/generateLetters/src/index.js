const AWS = require('aws-sdk');

const region = process.env.REGION;
AWS.config.update({ region });

exports.handler = async event => {
	return makeLetters();
};

function makeLetters() {
	// TODO: Maybe take these from the event for easy/medium/hard games?
	const CONSONANT_AMOUNT = 6;
	const VOWEL_AMOUNT = 2;

	const consonants = getRandomLetters(CONSONANT_AMOUNT, [
		'B',
		'C',
		'D',
		'F',
		'G',
		'H',
		'J',
		'K',
		'L',
		'M',
		'N',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'V',
		'W',
		'X',
		'Y',
		'Z',
	]);
	const vowels = getRandomLetters(VOWEL_AMOUNT, ['A', 'E', 'I', 'O', 'U']);

	return vowels.concat(consonants);
}

function getRandomLetters(length, letters) {
	let randomLetters = [];
	for (let i = length; i > 0; i = i - 1) {
		// Find random letter from the available set
		const letter = letters[Math.floor(Math.random() * letters.length)];

		// Remove chosen letter to avoid duplicates in later loops
		letters = letters.filter(l => l !== letter);

		// Save chosen letter
		randomLetters.push(letter);
	}

	return randomLetters;
}
