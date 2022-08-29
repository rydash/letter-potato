import './App.css';

import React from 'react';
import { Router, navigate } from '@gatsbyjs/reach-router';

import RoomEntry from '../RoomEntry';
import GameRoom from '../GameRoom';

import packageInfo from '../../package.json';

/**
 * The root component for Letter Potato.
 * Mounts either the game entry screen or the game room
 * depending if a room code and player name was provided.
 */
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			playerName: '',
			roomCode: '',
		};
	}

	handleEnterRoom = () => {
		const { roomCode } = this.state;

		navigate(`/room/${roomCode}`);
	};

	handlePlayerNameChange = event => {
		this.setState({ playerName: event.target.value.toUpperCase() });
	};

	handleRoomCodeChange = event => {
		this.setState({ roomCode: event.target.value.toUpperCase() });
	};

	render() {
		const { playerName, roomCode } = this.state;

		return (
			<div className="App">
				<header className="App-header">Letter Potato</header>
				<Router>
					<RoomEntry
						default
						path="/"
						playerName={playerName}
						roomCode={roomCode}
						onEnterRoom={this.handleEnterRoom}
						onPlayerNameChange={this.handlePlayerNameChange}
						onRoomCodeChange={this.handleRoomCodeChange}
					/>
					<GameRoom
						path="room/:roomCode"
						playerName={playerName}
						onPlayerNameChange={this.handlePlayerNameChange}
					/>
				</Router>
				<span className="App-version">v{packageInfo.version}</span>
			</div>
		);
	}
}

App.propTypes = {};

export default App;
