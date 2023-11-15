import {Link,Routes,Route} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import { useReducer,createContext, useEffect } from 'react'
import userReducer from './reducers/userReducer'
import axios from './axios/axios'
import Profile from './components/Profile'

export const appContext = createContext()

export function App() {

  const [userState,userDispatch] = useReducer(userReducer,{userDetails:{},profileData:{}})

  console.log(userState)

  function handleLogout() { 
    localStorage.removeItem('token')
    userDispatch({type:"LOGOUT_USER"})
  }

  useEffect(()=>{   //get user details on refresh if user is logged in already

    (async function(){
      if(localStorage.getItem('token')){
        try{
          const userDetails = await axios.get('/comcraft/getAccount',{
            headers:{
              Authorization: localStorage.getItem('token')
            }
          })
          userDispatch({type:'SET_USER',payload:userDetails.data})
        }
        catch(err){
          console.log(err)
        }
      }
    })()
   
  },[])

  return (

    <appContext.Provider value={{userState,userDispatch}}>
      <div>
        <nav>
              <img src='./src/images/cmlogo6.png' alt="logo" style={{width:"150px"}}/>
              {
                Object.keys(userState.userDetails).length ?
                  <> 
                    <Link to='/' className='Link'>Home</Link>
                    <Link to='' className='Link'>{userState.userDetails.username}</Link>
                    <Link to='/Profile' className='Link'>Profile</Link>
                    <Link to='/' className='Link' onClick={handleLogout}>Logout</Link>
                  </>
                  :
                  <>
                    <Link to='/' className='Link'>Home</Link>
                    <Link to='/register' className='Link'>Register</Link>
                    <Link to='/login' className='Link'>Login</Link>
                  </>
              }
        </nav>
        <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/register' element={<Register/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/Profile'element={<Profile/>}></Route>
        </Routes>
      </div>
    </appContext.Provider>
  )
}


