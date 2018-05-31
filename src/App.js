import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Menu from './components/Menu.js';
import Home from './pages/Home.js';
import Experiments from './pages/Experiments.js';
import About from './pages/About.js';
import Spiral from './pages/Spiral.js';
import Contact from './pages/Contact.js';
import Admin from './pages/Admin.js';
import Game from './pages/Game.js';
import Footer from './components/Footer.js';
import Store from './pages/Store.js';
import {connect} from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from './config';
import { addToken, addUserdata } from './actions/tokenActions.js';

require('../node_modules/normalize.css/normalize.css');
class App extends React.Component {

  tokenHandler () {
    let lsToken = localStorage.getItem('token')
    // console.log('store = ', this.props.token)
    // console.log('localstorage = ', lsToken)
    let that = this;
    if (this.props.token === 'blank' && lsToken) {
      //check if token still valid & if so, add it to the store
      axios
      .get(`${API_BASE_URL}/api/auth/validate`, 
        { headers: {"Authorization" : `Bearer ${lsToken}`} }
        )
      .then(function(response){
        console.log(response)

        if(response.data.valid) {
          //set store token
          that.props.dispatch(addUserdata(response.data.user));
          that.props.dispatch(addToken(lsToken));
        } else {
          localStorage.removeItem('token')
        }
      })
      .catch((err) => {
        console.error(err)
      });  
    }
  }
  componentDidUpdate () {
    this.tokenHandler();
  }
  componentDidMount () {
    this.tokenHandler();
  }
  render () {
    return (
      <Router>
        <div className="App">
          <header>
            <Menu token={this.props.token} />
          </header>
          <main>
            <Route exact path="/" component={Home} />
            <Route exact path="/Experiments" component={Experiments} />
            <Route exact path="/About" component={About} />
            <Route exact path="/Contact" component={Contact} />
            <Route exact path="/Spiral" component={Spiral} />
            <Route exact path="/Game" component={Game} />
            <Route exact path="/Admin" component={Admin} />
            <Route exact path="/Store" component={Store} />
          </main>
          <Footer />
        </div>
      </Router>
    );
  }
}

export const mapStateToProps = state => ({
    token: state.tokenReducer.token
});

export default connect(mapStateToProps)(App);