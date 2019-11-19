import React from 'react';
import './App.css';
import SiteContext from './SiteContext';
import Home from './pages/Home';
import Games from './pages/Games';
import Menu from './components/Menu';
import CanvasJump from './components/canvasJump';
import CanvasFly from './components/canvasFly';
import CanvasSwim from './components/canvasSwim';
import Admin from './pages/Admin';
import { Route } from 'react-router-dom';
import MazeService from './services/maze-service';
import TokenService from './services/token-service';

export default class App extends React.Component {
  
  constructor (props) {
    super(props);
    this.state = {
      loggedIn: TokenService.hasAuthToken(),
      mazes: [],
      ids: []
    }
  }
  componentDidMount () {
    MazeService.load_ids()
    .then( ids => {
   
      this.setState({ids})
    })
  }

  addMazes = (mazes) => {
    if (Array.isArray(mazes)) {
      this.setState({mazes})
    } else {
      let newMazes = [...this.state.mazes, mazes]
     
      this.setState({mazes: newMazes})
    }
  }

  deleteMazes = (mazeID) => {
    this.setState({mazes: this.state.mazes.filter( maze => mazeID !== maze.id) });
  }

  loginHandler = (loggedIn) => {
    this.setState({loggedIn})

    if (!loggedIn) {
      TokenService.clearAuthToken();
    }
  }

  render () {
    const contextValue = {
      loggedIn: this.state.loggedIn,
      mazes: this.state.mazes,
      addMazes: this.addMazes,
      deleteMazes: this.deleteMazes,
      ids: this.state.ids,
      loginHandler: this.loginHandler
     }

     return (
      <SiteContext.Provider value={contextValue}>
        <React.Fragment>
          <header><nav><Menu /></nav></header>
          <main>
          <Route exact path={'/'} component={ Home } />
          <Route exact path={'/games'} component={ Games } />
          <Route exact path={'/jump-game'} component={ CanvasJump } />
          <Route exact path={'/fly-game'} component={ CanvasFly } />
          <Route exact path={'/swim-game'} component={ CanvasSwim } />
          <Route exact path={'/admin'} component={ Admin } />
          </main>
          <footer></footer>
        </React.Fragment>
       </SiteContext.Provider>
     )
  }
}


