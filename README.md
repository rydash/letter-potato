# Letter Potato 🥔

Make the longest word you can with a limited set a letters!

## [**Start playing here!**](https://master.d1q0ulek6zddn4.amplifyapp.com/)

## Gameplay

Your goal is to create the longest, valid English word you know when you only have
eight letters to use. Letters can be repeated; this isn't a newspaper Jumble! The
only thing you can't do is use letters that aren't in that set of eight.

Letter Potato is played on your own time! Hop into a game room, find as many words
as you can think of, then come back later and see if you're still at the top of the
leaderboard.

### Room Codes

Any four-letter code will get you into a game. If you're the first person to
create a room, you'll start with a new set of eight letters and no discovered words.
If you enter a room code that someone else used before, you'll join a game with an
existing set of letters plus any words found by other players.

## This game is a Work In Progress!

This game isn't finished and doesn't look super nice yet!
Here are the major things under development:
* Preventing guesses while a previous guess is still being validated
* Returning to a recently-visited room after refreshing the browser
* Various development chores
    * Adding documentation
    * Adding Jest unit tests
    * Cleaning up CSS

## Contributing

### Getting in touch
Letter Potato tracks bugs and feature requests using [GitHub Issues](https://github.com/rydash/letter-potato/issues). Drop a line there!

Want to fix it yourself? Great! Fork this repo, write some code, and submit a pull request.

### Dependencies

Letter Potato was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Also, Letter Potato's backend services and deployment is managed with [AWS Amplify](https://aws-amplify.github.io/docs/).

Installing the Amplify CLI is highly encouraged!

Testing AWS Lambdas locally requires Node 10 LTS or higher.

### Building and Deploying

Deployments occur automatically through the [AWS Amplify Console](https://console.aws.amazon.com/amplify/home) for each new commit on the `master` branch.

Open an issue if you'd like further deployment options!

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.

#### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

## License
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
[included GNU General Public License](./LICENSE.md) for more details.

## Credits
Created by [Ryan McGill](mailto:ryanalanmcgill+letterpotato@gmail.com). Inspired by party games developed by [Jackbox Games](https://jackboxgames.com/games/).

And thank _you_ for playing! 🌈
