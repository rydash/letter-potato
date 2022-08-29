import './index.css';

import { Amplify } from 'aws-amplify';
import React from 'react';
import Modal from 'react-modal';
import { createRoot } from 'react-dom/client';

import App from './App';
import awsExports from './aws-exports';
import * as serviceWorker from './serviceWorker';

Amplify.configure(awsExports);

const container = document.getElementById('root');

// http://reactcommunity.org/react-modal/accessibility/
Modal.setAppElement(container);

const root = createRoot(container);
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
