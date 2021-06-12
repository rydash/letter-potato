/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const retrieveRoom = /* GraphQL */ `
  mutation RetrieveRoom($roomCode: String) {
    retrieveRoom(roomCode: $roomCode) {
      id
      roomCode
      letters
      foundWords
      createdAt
      updatedAt
    }
  }
`;
export const validateWord = /* GraphQL */ `
  mutation ValidateWord(
    $currentGuess: String
    $playerName: String
    $roomCode: String
  ) {
    validateWord(
      currentGuess: $currentGuess
      playerName: $playerName
      roomCode: $roomCode
    )
  }
`;
export const createRoom = /* GraphQL */ `
  mutation CreateRoom(
    $input: CreateRoomInput!
    $condition: ModelRoomConditionInput
  ) {
    createRoom(input: $input, condition: $condition) {
      id
      roomCode
      letters
      foundWords
      createdAt
      updatedAt
    }
  }
`;
export const updateRoom = /* GraphQL */ `
  mutation UpdateRoom(
    $input: UpdateRoomInput!
    $condition: ModelRoomConditionInput
  ) {
    updateRoom(input: $input, condition: $condition) {
      id
      roomCode
      letters
      foundWords
      createdAt
      updatedAt
    }
  }
`;
export const deleteRoom = /* GraphQL */ `
  mutation DeleteRoom(
    $input: DeleteRoomInput!
    $condition: ModelRoomConditionInput
  ) {
    deleteRoom(input: $input, condition: $condition) {
      id
      roomCode
      letters
      foundWords
      createdAt
      updatedAt
    }
  }
`;
