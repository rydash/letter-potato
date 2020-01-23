import './GameRoom.css';

import { API, graphqlOperation } from 'aws-amplify';
import React from 'react';
import Modal from 'react-modal';
import { string } from 'prop-types';

import shuffle from 'lodash/shuffle';

import awsconfig from '../aws-exports';
import { retrieveRoom, validateWord } from '../graphql/mutations';

import LoadingSpinner from '../LoadingSpinner';

import {
	ERROR,
	INVALID_WORD,
	LONGEST_WORD,
	NEW_WORD,
	OLD_WORD,
	TIED_WORD,
	UPDATE_INTERVAL_MS,
	UPDATE_MAXIMUM_RETRIES,
} from '../constants';

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
			// TODO: Refactor these Booleans into a roomState Object?
			isRoomLoading: true,
			isRoomSubmitting: false,
			isRoomTimedOut: false,
			isRoomUpdating: false,
			letters: [],
			submittedGuess: '',
			result: '',
			updateCounter: 0,
		};
	}

	async componentDidMount() {
		API.configure(awsconfig);
		await this.getRoom();

		this.setState({ isRoomLoading: false });

		this.setUpdateInterval();
	}

	componentWillUnmount() {
		this.clearUpdateInterval();
	}

	/**
	 * Updates the room periodically.
	 * @returns {undefined}
	 */
	setUpdateInterval = () => {
		this.updateInterval = setInterval(
			this.updateFoundWords,
			UPDATE_INTERVAL_MS
		);
	};

	/**
	 * Stops periodically updating the room.
	 * @returns {undefined}
	 */
	clearUpdateInterval = () => {
		clearInterval(this.updateInterval);
	};

	/**
	 * Gets all information about the current room.
	 * @returns {undefined}
	 */
	getRoom = async () => {
		const { roomCode } = this.props;

		const {
			data: {
				retrieveRoom: { letters, foundWords },
			},
		} = await API.graphql(graphqlOperation(retrieveRoom, { roomCode }));

		this.setState({ foundWords, isRoomLoading: false, letters });
	};

	/**
	 * Prepares the room for active updates.
	 * @returns {undefined}
	 */
	resetTimeout = () => {
		this.setState(
			{ isRoomTimedOut: false, updateCounter: 0 },
			this.updateFoundWords
		);
	};

	/**
	 * Gets the current list of found words for the current room.
	 * @returns {undefined}
	 */
	updateFoundWords = () => {
		const { updateCounter } = this.state;

		// Clear the update interval to avoid back-to-back requests.
		this.clearUpdateInterval();

		if (updateCounter >= UPDATE_MAXIMUM_RETRIES) {
			this.setState({ isRoomTimedOut: true });
		} else {
			this.setState({ isRoomUpdating: true }, async () => {
				const { roomCode } = this.props;

				// TODO: Getting all the room data just to update the foundWords list is a little expensive.
				// Refactor retrieveRoom to accept a list of keys whose values should be returned...?
				const {
					data: {
						retrieveRoom: { foundWords },
					},
				} = await API.graphql(graphqlOperation(retrieveRoom, { roomCode }));

				this.setState({
					foundWords,
					isRoomUpdating: false,
					updateCounter: updateCounter + 1,
				});

				// Restart the update interval so players who go inactive after guessing
				// continue to see newly found words.
				this.setUpdateInterval();
			});
		}
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

	/**
	 * Allow users to tap each letter in the grid to build a guess.
	 * This doesn't exclude keyboard input, but may make it easier to play on mobile.
	 * @param {String} letter
	 * @returns {undefined}
	 */
	handleLetterPress = letter => {
		const { currentGuess } = this.state;

		this.setState({ currentGuess: currentGuess + letter });
	};

	handleSubmit = async event => {
		event.preventDefault();

		const { currentGuess } = this.state;
		const { playerName, roomCode } = this.props;

		const submission = { currentGuess, playerName, roomCode };

		this.setState({ isRoomSubmitting: true });

		// TODO: Return early if currentGuess already present in local foundWords.
		// This should reduce invocations of the validateWord Lambda.

		try {
			const {
				data: { validateWord: result },
			} = await API.graphql(graphqlOperation(validateWord, submission));

			// Update the found words list with a player's new word.
			const shouldUpdateFoundWords = result !== INVALID_WORD;

			if (shouldUpdateFoundWords) {
				await this.updateFoundWords();
			}

			this.setState({ currentGuess: '', result, submittedGuess: currentGuess });
		} catch (err) {
			// TODO: Make erroring more pronounced, allow a user to reload and recover
			console.error(
				`Error when submitting ${currentGuess} to ${roomCode}`,
				err
			);
			this.setState({ result: ERROR });
		}

		this.setState({ isRoomSubmitting: false });
	};

	renderTimeoutModal = () => {
		const { isRoomTimedOut } = this.state;

		return (
			<Modal isOpen={isRoomTimedOut}>
				<header>Are you still there?</header>
				<button onClick={this.resetTimeout}>YES, LET'S PLAY!</button>
			</Modal>
		);
	};

	renderRoomInfo = () => {
		const { playerName, roomCode } = this.props;

		return (
			<div className="GameRoom-roomInfo">
				<span className="GameRoom-playerName">{playerName}</span>
				<span className="GameRoom-instruction">Find the longest word!</span>
				<span className="GameRoom-roomCode">{roomCode}</span>
			</div>
		);
	};

	renderLetters = () => {
		const { letters } = this.state;

		return (
			<>
				<button onClick={this.shuffleLetters}>SHUFFLE</button>
				<div className="GameRoom-letters">
					{letters.map(letter => (
						<button
							key={letter}
							className="GameRoom-letter"
							onClick={this.handleLetterPress.bind(this, letter)}
						>
							{letter}
						</button>
					))}
				</div>
			</>
		);
	};

	renderResult = () => {
		const {
			currentGuess,
			result,
			submittedGuess,
			isRoomSubmitting,
		} = this.state;

		let resultText = '';

		if (isRoomSubmitting) {
			resultText = `Guessing ${currentGuess}...`;
		} else {
			switch (result) {
				case INVALID_WORD:
					resultText = `${submittedGuess} isn't a valid guess! Try again.`;
					break;
				case OLD_WORD:
					// TODO: Name who found this word previously.
					resultText = `${submittedGuess} was already guessed by someone else!`;
					break;
				case NEW_WORD:
					resultText = `${submittedGuess} is new, but not the longest word!`;
					break;
				case TIED_WORD:
					resultText = `${submittedGuess} is new, and tied for the longest word!`;
					break;
				case LONGEST_WORD:
					resultText = `${submittedGuess} is the longest word found so far!`;
					break;
				case ERROR:
					resultText = "Your guess couldn't be processed. Try again!";
					break;
				default:
					return null;
			}
		}

		return <div className="GameRoom-result">{resultText}</div>;
	};

	renderGuess = () => {
		const { currentGuess, isRoomSubmitting } = this.state;

		return (
			<form onSubmit={this.handleSubmit}>
				<fieldset className="GameRoom-submit">
					<input
						className="GameRoom-submit-input"
						name="roomCode"
						type="text"
						disabled={isRoomSubmitting}
						onChange={this.handleGuessChange}
						pattern="[A-Za-z]+"
						placeholder="Type a word!"
						value={currentGuess}
					/>
					{this.renderResult()}
					{isRoomSubmitting ? (
						<LoadingSpinner />
					) : (
						<input type="submit" disabled={!currentGuess} value="GUESS" />
					)}
				</fieldset>
			</form>
		);
	};

	renderFoundWords = () => {
		const { foundWords, isRoomUpdating } = this.state;

		const foundWordsData = foundWords.map(wordData => JSON.parse(wordData));

		return (
			<>
				<div className="GameRoom-foundWords">
					<span className="GameRoom-foundWordHeader">Found Words</span>
					<span className="GameRoom-finderHeader">Finder</span>
					{foundWordsData
						.sort((a, b) => b.word.length - a.word.length)
						.map(({ playerName, word }) => (
							<React.Fragment key={word}>
								<div className="GameRoom-foundWord">{word}</div>
								<div className="GameRoom-finder">{playerName}</div>
							</React.Fragment>
						))}
				</div>

				{isRoomUpdating ? (
					<LoadingSpinner />
				) : (
					<button
						className="GameRoom-updateRoom"
						disabled={isRoomUpdating}
						onClick={this.updateFoundWords}
					>
						UPDATE
					</button>
				)}
			</>
		);
	};

	render() {
		const { isRoomLoading } = this.state;

		return (
			<div className="GameRoom">
				{isRoomLoading ? (
					<LoadingSpinner />
				) : (
					<>
						{this.renderTimeoutModal()}
						{this.renderRoomInfo()}
						{this.renderLetters()}
						{this.renderGuess()}
						{this.renderFoundWords()}
					</>
				)}
			</div>
		);
	}
}

GameRoom.propTypes = {
	playerName: string.isRequired,
	roomCode: string.isRequired,
};

export default GameRoom;
