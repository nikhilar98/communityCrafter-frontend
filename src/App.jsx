import {Link,Routes,Route} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import { useReducer,createContext, useEffect } from 'react'
import userReducer from './useReducerHook-reducers/userReducer'
import axios from './axios/axios'
import Profile from './components/Profile'
import { useDispatch } from 'react-redux'
import { startSetCategories } from './actions/categoryActions'

export const userContext = createContext()

export function App() {

  const [userState,userDispatch] = useReducer(userReducer,{userDetails:{},profileData:{},userAddresses:[]})

  const reduxDispatch = useDispatch()

  console.log("userState : ",userState)

  function handleLogout() { 
    localStorage.removeItem('token')
    userDispatch({type:"LOGOUT_USER"})
  }

  useEffect(()=>{   //get user details and app data on refresh if user is logged in already
    
    (async function(){
      if(localStorage.getItem('token')){
        try{
          const userDetails = await axios.get('/comcraft/getAccount',{
            headers:{
              Authorization: localStorage.getItem('token')
            }
          })
          userDispatch({type:'SET_USER',payload:userDetails.data})
          if(userDetails.data.role=='commuityHead' || userDetails.data.role=='teacher'){
            const userProfile = await axios.get('/comcraft/getProfile',{
              headers:{
                Authorization: localStorage.getItem('token')
              }
            })
            userDispatch({type:'SET_USER_PROFILE',payload:userProfile.data})
          }
          const userAddresses = await axios.get('/comcraft/address',{
            headers:{
              Authorization: localStorage.getItem('token')
            }
          })
          userDispatch({type:'SET_USER_ADDRESSES',payload:userAddresses.data})
          reduxDispatch(startSetCategories())
        }
        catch(err){
          console.log(err)
        }
      }
    })()

  },[])

  return (

    <userContext.Provider value={{userState,userDispatch}}>
      <div>
        <nav>
              <img src='./src/images/cmlogo6.png' alt="logo" style={{width:"70px"}}/>
              {
                Object.keys(userState.userDetails).length ?
                  <> 
                    <Link to='/' className='Link'>Home</Link>
                    {['communityHead','teacher'].includes(userState.userDetails.role) && <Link to='/Profile' className='Link'>Profile</Link>}
                    <Link to='/' className='Link' onClick={handleLogout}>Logout</Link>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" width='30px'>
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>

                  </>  //user logged in
                  :
                  <>
                    <Link to='/' className='Link'>Home</Link>
                    <Link to='/register' className='Link'>Register</Link>
                    <Link to='/login' className='Link'>Login</Link>
                  </>  //user logged out
              }
        </nav>
        <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/register' element={<Register/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/Profile'element={<Profile/>}></Route>
        </Routes>
      </div>
    </userContext.Provider>
  )
}


