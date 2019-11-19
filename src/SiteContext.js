import React from 'react'

const SiteContext = React.createContext({
  loggedIn: undefined,
  mazes: [],
  ids: []
})

export default SiteContext