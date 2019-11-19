import React from 'react';
import './Login.css';
import AuthApiService from '../../services/auth-api-services'
import SiteContext from '../../SiteContext';
export default class Login extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            password: '',
            errorMessage: ''
        }
    }
    static contextType = SiteContext;

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
        return (
            <form onSubmit={ this.onSubmit }>
                <input type="password" onChange={ e => this.onChangeHandler(e) } value={this.state.password} />
                <input type="submit" />
                <div className="feedback">{ this.state.errorMessage }</div>
            </form>
        )
    }
}