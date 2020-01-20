import './GameRoom.css';

import { API, graphqlOperation } from 'aws-amplify';
import React from 'react';
import ClimbingBlockLoader from 'react-spinners/ClimbingBoxLoader';

import shuffle from 'lodash/shuffle';

import awsconfig from '../aws-exports';
import { retrieveRoom, validateWord } from '../graphql/mutations';

/**
 * The play area for a game of Letter Potato.
 * Contains submissions by other players, the room's letters and
 * a field to guess a new word using those letters.
 */
class GameRoom extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentGuess: '',
			foundWords: [],
			isLoading: true,
			letters: [],
			submittedGuess: '',
			result: '',
		};
	}

	componentDidMount() {
		API.configure(awsconfig);
		this.getRoom();
	}

	/**
	 * TODO: Call this on an interval? When the component updates? Other?
	 * Gets information about the current room from a database.
	 * @returns {undefined}
	 */
	getRoom = async () => {
		const { roomCode } = this.props;

		const {
			data: {
				retrieveRoom: { letters, foundWords },
			},
		} = await API.graphql(graphqlOperation(retrieveRoom, { roomCode }));

		this.setState({ foundWords, isLoading: false, letters: shuffle(letters) });
	};

	/**
	 * Randomizes the arrangement of the room's letters.
	 * This only happens on the user's controller, to encourage new guesses.
	 */
	shuffleLetters = () => {
		const { letters } = this.state;
		this.setState({ letters: shuffle(letters) });
	};

	handleGuessChange = event => {
		this.setState({ currentGuess: event.target.value.toUpperCase() });
	};

	handleSubmit = async event => {
		event.preventDefault();

		const { currentGuess } = this.state;
		const { playerName, roomCode } = this.props;

		const submission = { currentGuess, playerName, roomCode };

		// TODO: Return early if currentGuess already present in local foundWords.
		// This should reduce invocations of the validation Lambda.

		try {
			const {
				data: { validateWord: result },
			} = await API.graphql(graphqlOperation(validateWord, submission));

			this.setState({ result, submittedGuess: currentGuess });
		} catch (err) {
			// TODO: Make erroring more pronounced, allow a user to reload and recover
			console.error(
				`Error when submitting ${currentGuess} to ${roomCode}`,
				err
			);
			this.setState({ result: 'ERROR' });
		}
	};

	renderRoomInfo = () => {
		const { playerName, roomCode } = this.state;

		return (
			<div className="GameRoom-roomInfo">
				Room Code: {roomCode}
				Name: {playerName}
			</div>
		);
	};

	renderLetters = () => {
		const { letters } = this.state;

		return (
			// TODO: Display this as a fancy grid with big letters
			<div className="GameRoom-letters">
				Letters: {letters}
				<button onClick={this.shuffleLetters}>Shuffle</button>
			</div>
		);
	};

	renderResult = () => {
		const { result, submittedGuess } = this.state;

		let resultText = '';
		switch (result) {
			case 'INVALID_WORD':
				resultText = `${submittedGuess} isn't a valid word! Try again.`;
				break;
			case 'OLD_WORD':
				// TODO: Name who found this word previously.
				resultText = `${submittedGuess} was already guessed by someone else!`;
				break;
			case 'NEW_WORD':
				resultText = `${submittedGuess} is new, but not the longest!`;
				break;
			case 'TIED_WORD':
				resultText = `${submittedGuess} is new, and tied for the longest!`;
				break;
			case 'LONGEST_WORD':
				resultText = `${submittedGuess} is the longest word found so far!`;
				break;
			case 'ERROR':
				resultText = "Your guess couldn't be processed. Try again!";
				break;
			default:
				return null;
		}

		return <div className="GameRoom-result">{resultText}</div>;
	};

	renderGuess = () => {
		const { currentGuess } = this.state;

		// TODO: Style this a bunch
		return (
			<div className="GameRoom-submit">
				<form onSubmit={this.handleSubmit}>
					<fieldset className="GameRoom-submit">
						<input
							name="roomCode"
							type="text"
							onChange={this.handleGuessChange}
							pattern="[A-Za-z]+"
							placeholder="Guess an English word!"
							title="Letters only, please."
							value={currentGuess}
						/>
						<input
							type="submit"
							disabled={currentGuess.length < 0}
							value="GUESS"
						/>
					</fieldset>
				</form>
			</div>
		);
	};

	renderFoundWords = () => {
		const { foundWords } = this.state;

		const foundWordsData = foundWords.map(wordData => JSON.parse(wordData));

		return (
			<div className="GameRoom-foundWords">
				Words found so far:
				{foundWordsData
					.sort((a, b) => b.word.length - a.word.length)
					// TODO: Used fixed-width font for found words, for visual niceness
					.map(({ playerName, word }) => (
						<p key={word}>
							<span className="GameRoom-foundWord">{word}</span> by {playerName}
						</p>
					))}
			</div>
		);
	};

	render() {
		const { isLoading } = this.state;

		return isLoading ? (
			// TODO: Center this with CSS
			<ClimbingBlockLoader color="#d38b40" loading={isLoading} />
		) : (
			<div className="GameRoom">
				{this.renderRoomInfo()}
				{this.renderLetters()}
				{this.renderResult()}
				{this.renderGuess()}
				{this.renderFoundWords()}
			</div>
		);
	}
}

GameRoom.propTypes = {
	/* TODO */
};

export default GameRoom;
