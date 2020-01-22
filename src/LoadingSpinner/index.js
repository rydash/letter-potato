import './LoadingSpinner.css';

import BeatLoader from 'react-spinners/BeatLoader';
import React from 'react';

import { LOADING_COLOR } from '../constants';

const LoadingSpinner = () => (
	<div className="LoadingSpinner">
		<BeatLoader color={LOADING_COLOR} />
	</div>
);

export default LoadingSpinner;
