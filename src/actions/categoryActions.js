import axios from "../axios/axios"

export function startSetCategories() {
    return async (dispatch,getState) => { 
        try{
            const categories = await axios.get('/comcraft/categories')
            dispatch(setCategories(categories.data))
        }
        catch(err){
            console.log(err)
        }
    }
}


const setCategories = (categories) => { 
    return {type:'SET_CATEGORIES',payload:categories}
}

