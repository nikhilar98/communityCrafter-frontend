import axios from "../axios/axios"

export default function startSetClasses(userId){ 
    return async (dispatch,getState)=> { 
        try{
            const response = await axios.get('/comcraft/classRequirements',{
                headers:{
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(setClasses(response.data))
        }
        catch(err){
            console.log(err)
        }
    }
}

function setClasses(classes) { 
    return {type:'SET_TEACHER_CLASSES',payload:classes}
}

