import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import {crudReducer} from './reducers';

const initialState = window.INITIAL_STATE;
const middleware = applyMiddleware(logger);
 
export default createStore(crudReducer,initialState, middleware);