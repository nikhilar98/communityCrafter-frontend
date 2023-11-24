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
import AddressForm from './components/AddressForm'
import RequirementsList from './components/RequirementsList'
import RequirementCreate from './components/RequirementCreate'
import RequirementDisplay from './components/RequirementDisplay'
import logo from './images/cmlogo6.png'
import ProfileShow from './components/ProfileShow'
import TutorClassesList from './components/TutorClassesList'
import startSetClasses from './actions/classesActions'
import { ClassDetailsDisplay } from './components/ClassDetailsDisplay'
import PaymentResult from './components/paymentResult'




export const userContext = createContext()

export function App() {

  const [userState,userDispatch] = useReducer(userReducer,{userDetails:{},profileData:{},userAddresses:[],requirements:[],requirementsSortingOrder:'ascending',searchDistance:20000})

  const reduxDispatch = useDispatch()

  console.log("userState : ",userState)

  function handleLogout() { 
    localStorage.removeItem('token')
    userDispatch({type:"LOGOUT_USER"})
  }

  useEffect(()=>{   //get user details and app data on refresh if user is logged in already
    
    (async function(){
      try{
          reduxDispatch(startSetCategories())
          if(localStorage.getItem('token')){
          
            const userDetails = await axios.get('/comcraft/getAccount',{
              headers:{
                Authorization: localStorage.getItem('token')
              }
            })
            userDispatch({type:'SET_USER',payload:userDetails.data})
           
            if(userDetails.data.role=='communityHead' || userDetails.data.role=='teacher'){
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

            if(userDetails.data.role=='teacher'){
              const userProfile = await axios.get('/comcraft/getProfile',{
                headers:{
                  Authorization: localStorage.getItem('token')
                }
              })
              if(userProfile.data.address){  ///make the api call only if 
                const requirements = await axios.get(`/comcraft/classRequirements/pending?sortOrder=${userState.requirementsSortingOrder}&searchDistance=${userState.searchDistance}`,{
                  headers:{
                      Authorization: localStorage.getItem('token')
                  }
                  })  //for getting all pending community requirements based on teachers location
                  console.log('teacher requirements',requirements.data)  
                  userDispatch({type:"SET_USER_REQUIREMENTS",payload:requirements.data})
              }
            }
            else if(userDetails.data.role=='communityHead'){
                const requirements = await axios.get(`/comcraft/classRequirements?sortOrder=${userState.requirementsSortingOrder}`,{
                headers:{
                    Authorization: localStorage.getItem('token')
                }
                }) //for getting all requirements created by a cm head
                userDispatch({type:"SET_USER_REQUIREMENTS",payload:requirements.data})
                
            }
            if(userDetails.data.role=='teacher'){
              reduxDispatch(startSetClasses())
            }
        }
      }
      catch(err){
        console.log(err)
      }
      
    })()

  },[])

  return (

    <userContext.Provider value={{userState,userDispatch}}>
      <div>
        <nav style={{display:"flex",alignItems:'center',justifyContent:"space-between",paddingRight:"20px"}}>
              {
                Object.keys(userState.userDetails).length ?
                  <>
                    <div style={{display:"flex",alignItems:'center',justifyContent:"center"}}>
                      <img src={logo} alt="logo" style={{width:"70px"}}/>
                      <Link to='/' className='Link'>Home</Link>
                      {['communityHead','teacher'].includes(userState.userDetails.role) && <Link to='/profile' className='Link'>Profile</Link>}
                      {userState.userDetails.role=='teacher' && <Link to='/requirements' className='Link'>Community Requirements</Link>}
                      {userState.userDetails.role=='teacher' && <Link to='/classes' className='Link'>My classes</Link>}
                      {userState.userDetails.role=='communityHead' && <Link to='/create-requirement' className='Link'>Create requirement</Link>}
                      {userState.userDetails.role=='communityHead' && <Link to='/myRequirements' className='Link'>My requirements</Link>}
                    </div>
                    <div style={{display:"flex",alignItems:'center',justifyContent:"center"}}>
                      <Link to='/' className='Link' onClick={handleLogout}>Logout</Link>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" width='30px'>
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                      </svg>
                      <span>{userState.userDetails.username}</span>
                    </div>
                  </> //user logged in
                  :
                  <div style={{display:"flex",alignItems:'center',justifyContent:"center"}}> 
                    <img src={logo} alt="logo" style={{width:"70px"}}/>
                    <Link to='/' className='Link'>Home</Link>
                    <Link to='/register' className='Link'>Register</Link>
                    <Link to='/login' className='Link'>Login</Link>
                  </div>  //user logged out
              }
        </nav>
        <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/register' element={<Register/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/profile'element={<Profile/>}></Route>
            <Route path='/address' element={<AddressForm/>}></Route>
            <Route path='/create-requirement' element={<RequirementCreate/>}></Route>
            <Route path='/myRequirements' element={<RequirementsList/>}></Route>
            <Route path='/requirements' element={<RequirementsList/>}></Route>
            <Route path='/requirement/:id' element={<RequirementDisplay/>}></Route>
            <Route path='/tutor/:tutorId' element={<ProfileShow/>}></Route>
            <Route path='/classes' element={<TutorClassesList/>}></Route>
            <Route path='/classes/:classId' element={<ClassDetailsDisplay/>}></Route>
            <Route path='/create-checkout-session/requirement' element={<PaymentResult/>} ></Route>
        </Routes>
      </div>
    </userContext.Provider>
  )
}


