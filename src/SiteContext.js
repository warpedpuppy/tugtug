import React from 'react'

const SiteContext = React.createContext({
  loggedIn: undefined,
  mazes: [],
  ids: [],
  mazeGame: false,
  activeMazeId: undefined,
  inGameMazeEdit: false,
  mazeGameAction: true
})

export default SiteContext