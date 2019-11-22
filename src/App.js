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
import { Switch, Route } from 'react-router-dom';
import MazeService from './services/maze-service';
import TokenService from './services/token-service';
import NotFound from './pages/NotFound';
export default class App extends React.Component {
  
  constructor (props) {
    super(props);
    this.state = {
      loggedIn: TokenService.hasAuthToken(),
      mazes: [],
      ids: [],
      mazeGame: false,
      activeMazeId: undefined,
      inGameMazeEdit: false,
      mazeGameAction: true
    }
  }
  componentDidMount () {
    MazeService.load_ids()
    .then( ids => {
      let activeMazeId = ids[0].id
      this.setState({ids, activeMazeId})
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

  deleteMazes = (mazeID) => {
    this.setState({mazes: this.state.mazes.filter( maze => mazeID !== maze.id) });
  }

  mazeGameHandler = (mazeGame) => {
    this.setState({mazeGame});
  }
  setActiveMazeId = (activeMazeId) => {
    this.setState({activeMazeId});
  }
  setInGameMazeEdit = (inGameMazeEdit) => {
    this.setState({inGameMazeEdit});
  }
  setMazeGameAction = (mazeGameAction) => {
    this.setState({mazeGameAction});
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
      loginHandler: this.loginHandler,
      mazeGame: this.state.mazeGame,
      mazeGameHandler: this.mazeGameHandler,
      activeMazeId: this.state.activeMazeId,
      setActiveMazeId: this.setActiveMazeId,
      inGameMazeEdit: this.state.inGameMazeEdit,
      setInGameMazeEdit: this.setInGameMazeEdit,
      mazeGameAction: this.state.mazeGameAction,
      setMazeGameAction: this.setMazeGameAction
     }

     return (
      <SiteContext.Provider value={contextValue}>
        <React.Fragment>
          <header><nav><Menu /></nav></header>
          <main>
            <Switch>
              <Route exact path={'/'} component={ Home } />
              <Route exact path={'/games'} component={ Games } />
              <Route exact path={'/jump-game'} component={ CanvasJump } />
              <Route exact path={'/fly-game'} component={ CanvasFly } />
              <Route exact path={'/swim-game'} component={ CanvasSwim } />
              <Route exact path={'/admin'} component={ Admin } />
              <Route component={ NotFound } />
            </Switch>
          </main>
          <footer></footer>
        </React.Fragment>
       </SiteContext.Provider>
     )
  }
}


