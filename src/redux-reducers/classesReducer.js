const initialState = [] 
const classesReducer = (state=initialState,action) => { 
    switch(action.type){
        case 'SET_TEACHER_CLASSES':{ 
            return [...action.payload]
        }
        default : return [...state]
    }
}
export default classesReducer