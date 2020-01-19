/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const retrieveRoom = `mutation RetrieveRoom($roomCode: String) {
  retrieveRoom(roomCode: $roomCode) {
    roomCode
    letters
    foundWords
  }
}
`;
export const validateWord = `mutation ValidateWord(
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
export const createRoom = `mutation CreateRoom(
  $input: CreateRoomInput!
  $condition: ModelRoomConditionInput
) {
  createRoom(input: $input, condition: $condition) {
    roomCode
    letters
    foundWords
  }
}
`;
export const updateRoom = `mutation UpdateRoom(
  $input: UpdateRoomInput!
  $condition: ModelRoomConditionInput
) {
  updateRoom(input: $input, condition: $condition) {
    roomCode
    letters
    foundWords
  }
}
`;
export const deleteRoom = `mutation DeleteRoom(
  $input: DeleteRoomInput!
  $condition: ModelRoomConditionInput
) {
  deleteRoom(input: $input, condition: $condition) {
    roomCode
    letters
    foundWords
  }
}
`;
