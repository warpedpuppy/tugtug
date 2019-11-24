import React from 'react';
import './Login.css';
import AuthApiService from '../../services/auth-api-services'
import SiteContext from '../../SiteContext';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
export default class Login extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            password: '',
            errorMessage: ''
        }
    }
    static contextType = SiteContext;
    
    logOutHandler = (e) => {
        e.preventDefault();
        this.context.loginHandler(false);
    }
    
    onSubmit = (e) => {
        e.preventDefault();
        this.setState({errorMessage: ''})
        AuthApiService.postLogin(this.state.password)
        .then( result => {
            this.setState({password: ''})
            if (result.login === true) {
                this.context.loginHandler(true);
            } else {
                this.setState({errorMessage: 'There was a problem.'})
            }
        })

    }

    onChangeHandler = (e) => {
        this.setState({password: e.target.value})
    }

    render () {
        if (!this.context.loggedIn) {
            return (
                <div className="login-form">
                    <Form  onSubmit={ this.onSubmit }>
                        <Row>
                            <Col>
                                <Form.Control type="password"  onChange={ e => this.onChangeHandler(e) } value={this.state.password} />
                            </Col>
                            <Col>
                                <Form.Control type="submit" />
                            </Col>
                        </Row>
                        <Row>
                            <div className="feedback">{ this.state.errorMessage }</div>
                        </Row>
                </Form>
              </div>
            )
        } else {
            return (
                <div className="login-form">
                    <Button variant="danger" onClick={ this.logOutHandler }>log out</Button>
                </div>
            )
        }
    }
}