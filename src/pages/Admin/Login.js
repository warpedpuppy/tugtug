import React from 'react';
import './Login.css';
import AuthApiService from '../../services/auth-api-services'

export default class Login extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            password: '',
            errorMessage: ''
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({errorMessage: ''})
        AuthApiService.postLogin(this.state.password)
        .then( result => {
            console.log(result);
            this.setState({password: ''})
            if (result.login === true) {
                this.props.changeLoggedIn();
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