import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Menu from './components/Menu.js';
import Home from './pages/Home.js';
import About from './pages/About.js';
import Contact from './pages/Contact.js';
import Footer from './components/Footer.js';
import {connect} from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from './config';
import { addToken, addUserdata } from './actions/tokenActions.js';
import { addItems } from './actions/avatarActions.js';
import TempLogIn from './components/loginRegister/tempLogin';
require('../node_modules/normalize.css/normalize.css');

class App extends React.Component {

  constructor (props) {
    super(props);
    this.loggedInCheck = this.loggedInCheck.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.state = {
      loggedIn: false,
      showStartScreen: true,
      page: 'page'
    }
  }

  loggedInCheck () {
    this.setState({loggedIn:true})
  }



  tokenHandler () {

    let lsToken = localStorage.getItem('token')
    let that = this;
    if (this.props.token === 'blank' && lsToken) {
        axios
        .get(`${API_BASE_URL}/api/auth/validate`, 
          { headers: {"Authorization" : `Bearer ${lsToken}`} }
        )
        .then(function(response){
          if(response.data.valid) {

            //set store token & userdata
            that.props.dispatch(addUserdata(response.data.user));
            that.props.dispatch(addToken(lsToken));

            if (response.data.user) {
             that.props.dispatch(addItems(response.data.user.accessories));
            }

          } else {
            localStorage.removeItem('token')
          }
        })
        .catch((err) => {
          localStorage.removeItem('token')
        });  
    }
  }
  componentDidUpdate () {
    this.tokenHandler();
  }
  componentDidMount () {
    this.tokenHandler();
    this.pageChange();
  }
  pageChange () {
    this.setState({page: window.location.pathname})
  }
  render () {

    if (this.state.loggedIn) {
      return (
        <Router>
          <div className="App">
            <header>
              <Menu token={this.props.token} />
            </header>
            <main>
              <Route 
                exact 
                path="/" 
                render={(props) => <Home pageChange={this.pageChange}/>}  
              />
              <Route 
                path="/about"  
                render={(props) => <About pageChange={this.pageChange}/>}  
              />
              <Route 
                path="/contact"  
                render={(props) => <Contact pageChange={this.pageChange}/>}  
              />
            
            </main>
            <Footer page={ this.state.page } />
          </div>
        </Router>
      );
    } else {
      return (
        <div>
          <TempLogIn loggedInFunction={this.loggedInCheck}/>
        </div>
      )
    }
  }
}

export const mapStateToProps = state => ({
    token: state.tokenReducer.token
});

export default connect(mapStateToProps)(App);