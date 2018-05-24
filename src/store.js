import {applyMiddleware, createStore} from 'redux';
import logger from 'redux-logger';
import reducers from './reducers';

const initialState = window.INITIAL_STATE;
const middleware = applyMiddleware(logger);
 
export default createStore(reducers,initialState, middleware);