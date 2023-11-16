const initialState= []
const categoriesReducer = (state=initialState,action) => { 
    switch(action.type){

        case "SET_CATEGORIES" : {
            return [...action.payload]
        }

        default : return [...state]
    }

}

export default categoriesReducer