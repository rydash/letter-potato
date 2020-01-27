import React from 'react';
import { func, string } from 'prop-types';

// TODO: Show remaining character counter opposite NAME label
// TODO: Migrate specific CSS to component, extract from RoomEntry/GameRoom
const NameEntry = ({ onPlayerNameChange, playerName }) => (
	<>
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
	</>
);

NameEntry.propTypes = {
	onPlayerNameChange: func.isRequired,
	playerName: string.isRequired,
};

export default NameEntry;
