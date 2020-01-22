import './RoomEntry.css';

import React from 'react';
import { func, string } from 'prop-types';

/**
 * A form for a player to enter their name and a room code.
 */
class RoomEntry extends React.Component {
	handleSubmit = event => {
		event.preventDefault();

		const { onEnterRoom } = this.props;

		onEnterRoom();
	};

	render() {
		const {
			onPlayerNameChange,
			onRoomCodeChange,
			playerName,
			roomCode,
		} = this.props;

		// TODO: Show remaining character counter opposite NAME label
		return (
			<div className="RoomEntry">
				<form onSubmit={this.handleSubmit}>
					<fieldset className="RoomEntry-submit">
						<label htmlFor="roomCode">ROOM CODE</label>
						<input
							name="roomCode"
							type="text"
							maxLength="4"
							onChange={onRoomCodeChange}
							pattern="[A-Za-z]{4}"
							placeholder="ENTER 4-LETTER CODE"
							required
							value={roomCode}
						/>
						<label htmlFor="playerName">NAME</label>
						<input
							name="playerName"
							type="text"
							maxLength="12"
							onChange={onPlayerNameChange}
							placeholder="ENTER YOUR NAME"
							required
							value={playerName}
						/>
						<input
							type="submit"
							disabled={roomCode.length < 4 || !playerName}
							value="PLAY"
						/>
					</fieldset>
				</form>
			</div>
		);
	}
}

RoomEntry.propTypes = {
	playerName: string.isRequired,
	roomCode: string.isRequired,
	onEnterRoom: func.isRequired,
	onPlayerNameChange: func.isRequired,
	onRoomCodeChange: func.isRequired,
};

export default RoomEntry;
