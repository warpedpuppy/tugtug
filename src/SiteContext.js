import React from 'react'

const SiteContext = React.createContext({
  loggedIn: undefined,
  mazes: [],
  ids: [],
  mazeGame: false,
  activeMazeId: undefined
})

export default SiteContext