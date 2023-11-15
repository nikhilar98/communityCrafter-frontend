const userReducer = (state,action) => { 
    switch(action.type){

        case 'SET_USER':{
            return {...state,userDetails:action.payload}
        }
        case 'SET_USER_PROFILE':{
            return {...state,profileData:action.payload}
        }
        case 'LOGOUT_USER' : { 
            return {...state,userDetails:{}}
        }

        default : return {...state}
    }
}

export default userReducer
