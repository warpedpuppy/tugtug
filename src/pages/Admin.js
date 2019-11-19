import React from 'react';
import Login from './Admin/Login';
import LoggedIn from './Admin/LoggedIn';
import './Admin.css';
import Container from 'react-bootstrap/Container';
import SiteContext from '../SiteContext';

class Admin extends React.Component {

  static contextType = SiteContext;

  render () {
    if (this.context.loggedIn) {
      return (
          <Container className="App">
            <LoggedIn />
          </Container>
      );
    } else {
        return (
          <Container className="App">
            <Login />
          </Container>
        );
    }
  }
}

export default Admin;
