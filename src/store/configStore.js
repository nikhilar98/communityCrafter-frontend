import {createStore,combineReducers,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import categoriesReducer from '../redux-reducers/categoriesReducer'

const configStore = () => { 

    const store = createStore(combineReducers({
        categories: categoriesReducer
    }),applyMiddleware(thunk))

    return store
}

export default configStore



