import React from 'react';
import Button from 'react-bootstrap/Button';
import SiteContext from '../../SiteContext';

export default class AdminHome extends React.Component {
    static contextType = SiteContext;

    logOutHandler = (e) => {
        e.preventDefault();
        //clear token

        //set context to logged out
        this.context.loginHandler(false);
    }
    render(){
        return (
            <Button variant="danger" onClick={ this.logOutHandler }>log out</Button>

        )
    }
  
}