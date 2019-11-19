import React from 'react';
import './App.css';
import SiteContext from './SiteContext';
import Home from './pages/Home';
import Games from './pages/Games';
import Menu from './components/Menu';
import CanvasJump from './components/canvasJump';
import CanvasFly from './components/canvasFly';
import CanvasSwim from './components/canvasSwim';
import Admin from './pages/Admin/Login';
import { Route } from 'react-router-dom';

export default class App extends React.Component {
  
  constructor (props) {
    super(props);
    this.state = {
      loggedIn: false
    }
  }

  render () {
    const contextValue = {
      loggedIn: this.state.loggedIn
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


