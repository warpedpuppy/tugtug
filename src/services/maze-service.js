import config from '../config'
import TokenService from './token-service'
const MazeService = {
    load_ids: function() {
        return fetch(`${config.API_ENDPOINT}/tugtug/get-grid-ids`, {
            method: 'GET',
            headers: {
              'content-type': 'application/json'
            }
          })
          .then(res => res.json())
          .then( res => {
            return res;
          })
          .catch( error => {
            console.error(error)
          })
    },
    getOneMaze: function(id) {
        return fetch(`${config.API_ENDPOINT}/tugtug/get-grid`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'Authorization': `Bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify({ id }),
          })
          .then(res => res.json())
          .then( res => {
            return res;
          })
          .catch( error => {
            console.error(error)
          })
    },
    loadAllMazes: function(data) {
      return fetch(`${config.API_ENDPOINT}/tugtug/all-mazes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${TokenService.getAuthToken()}`
        },
      })
      .then(res => res.json())
      .then( res => {
        return res;
      })
      .catch( error => {
        console.error(error)
      })
    },
    saveMaze: function(data) {
        return fetch(`${config.API_ENDPOINT}/tugtug/new-maze`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'Authorization': `Bearer ${TokenService.getAuthToken()}`
            },
            body: JSON.stringify({ data }),
          })
          .then(res => res.json())
          .then( res => {
            console.log("maze-service", res)
            if(res.success) {
              return res;
            }
          })
          .catch( error => {
            console.error(error)
          })
    },
    deleteMaze: function (id) {
      return fetch(`${config.API_ENDPOINT}/tugtug/delete-maze`, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${TokenService.getAuthToken()}`
        },
        body: JSON.stringify({ id }),
      })
      .then(res => res.json())
      .then( res => {
        //console.log("maze-service", res)
      })
      .catch( error => {
        //console.error(error)
      })
    }

}

export default MazeService;