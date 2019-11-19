import config from '../config'
import TokenService from './token-service'

const AuthApiService = {
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
            /*
            whenever a logint is performed:
            1. save the token in local storage
            2. queue auto logout when the user goes idle
            3. queue a call to the refresh endpoint based on the JWT's exp value
            */
            if (res.authToken) {
               TokenService.saveAuthToken(res.authToken);
               return {login: true}
            } else {
              return {login: false}
            }
           
            // IdleService.regiserIdleTimerResets()
            // TokenService.queueCallbackBeforeExpiry(() => {
            //     AuthApiService.postRefreshToken()
            // })
            
        })
        .catch( error => {
            console.error(error)
        })
      },

}

export default AuthApiService