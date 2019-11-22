import React from 'react';
import LoggedIn from './Admin/LoggedIn';
import './Admin.css';
import Container from 'react-bootstrap/Container';
import SiteContext from '../SiteContext';

class Admin extends React.Component {

  static contextType = SiteContext;

  render () {
      return (
          <Container className="App">
            <LoggedIn />
          </Container>
      );
  }
}

export default Admin;
