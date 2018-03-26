import {createStore} from 'redux'

import {crudReducer} from './reducers';

export default createStore(crudReducer);