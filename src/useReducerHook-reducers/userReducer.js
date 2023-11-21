const userReducer = (state,action) => { 
    switch(action.type){

        case 'SET_USER':{
            return {...state,userDetails:action.payload}
        }
        case 'SET_USER_PROFILE':{
            return {...state,profileData:action.payload}
        }
        case 'LOGOUT_USER' : { 
            return {...state,userDetails:{},profileData:{},userAddresses:[],requirements:[]}
        }
        case 'SET_USER_ADDRESSES' : { 
            return {...state,userAddresses:action.payload}
        }
        case 'ADD_USER_ADDRESS' : { 
            return {...state,userAddresses:[...state.userAddresses,action.payload]}
        }
        case 'SET_USER_REQUIREMENTS' : { 
            return {...state,requirements:action.payload}
        }
        case 'UPDATE_USER_REQUIREMENT' : { 
            const updatedRequirements = state.requirements.map(ele=>{
                if(ele._id==action.payload._id){
                    return {...action.payload}
                }else {
                    return {...ele}
                }
            })
            return {...state,requirements:updatedRequirements}
        }
        default : return {...state}
    }
}

export default userReducer
