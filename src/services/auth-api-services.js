import config from '../config'
import TokenService from './token-service'

const AuthApiService = {
    showLoginForm: function(code) {

      return fetch(`${config.API_ENDPOINT}/auth/show-login-form`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
      .then(result => result.json())
      .then(resultJson => {
        return resultJson;
      })

    },
    postLogin: function(password) {
        return fetch(`${config.API_ENDPOINT}/auth/login`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ password }),
        })
        .then( res => {
            return  ((!res.ok)
            ? res.json().then(e => Promise.reject(e))
            : res.json( ))
        })
        .then(res => {
            if (res.authToken) {
               TokenService.saveAuthToken(res.authToken);
               return {login: true}
            } else {
              return {login: false}
            }
        })
        .catch( error => {
            console.error(error)
        })
      },

}

export default AuthApiService