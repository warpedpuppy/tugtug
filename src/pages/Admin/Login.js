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
            errorMessage: '',
            showForm: false,
            codeEnter: ''
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
                this.setState({errorMessage: 'This was not correct.'})
            }
        })

    }
    buttonClicked = (e) => {
        if (this.state.codeEnter.length < 4) {
            this.setState({codeEnter: this.state.codeEnter + e.target.innerHTML})
        } else {
            let removeLeftDigit = this.state.codeEnter.substr(1) + e.target.innerHTML
            this.setState({codeEnter: removeLeftDigit})
        }
    }
    submitCode = async (e) => {
       let result =  await AuthApiService.showLoginForm(this.state.codeEnter);
       
       if (result.success) {
        this.setState({showForm: true})
       }


    }

    onChangeHandler = (e) => {
        this.setState({password: e.target.value})
    }

    render () {
        let buttons = Array.from(Array(9).keys()).map( item => {
            let buttonNum = item + 1;
            return <span onClick={this.buttonClicked} key={buttonNum}>{buttonNum}</span>
        })
        if (this.context.loggedIn) {
            return (
                <div className="login-form">
                    <Button variant="danger" onClick={ this.logOutHandler }>log out</Button>
                </div>
            )
        
        } else if (!this.state.showForm) {
            return (
                <div className="keyPad">
                    <div>
                     {buttons}
                     </div>
                     <div><Button onClick={this.submitCode}>submit code</Button></div>
                     <div>{this.state.codeEnter}</div>
                </div>
            )
        } else if (!this.context.loggedIn) {
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
           
        }
    }
}