import {createStore,combineReducers,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

const configStore = () => { 

    const store = createStore(combineReducers({
        user: usersReducer
    }),applyMiddleware(thunk))

    return store
}

export default configStore



