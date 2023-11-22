import {createStore,combineReducers,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import categoriesReducer from '../redux-reducers/categoriesReducer'
import classesReducer from '../redux-reducers/classesReducer'

const configStore = () => { 

    const store = createStore(combineReducers({
        categories: categoriesReducer,
        teacherClasses : classesReducer
    }),applyMiddleware(thunk))

    return store
}

export default configStore



