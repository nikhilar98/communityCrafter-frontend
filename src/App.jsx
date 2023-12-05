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
import ProfileShow from './components/ProfileShow'
import TutorClassesList from './components/TutorClassesList'
import startSetClasses from './actions/classesActions'
import { ClassDetailsDisplay } from './components/ClassDetailsDisplay'
import PaymentResult from './components/PaymentResult'
import Header from './components/Header'
import TutorsListing from './components/TutorsListing'




export const userContext = createContext()

export function App() {

  const [userState,userDispatch] = useReducer(userReducer,{userDetails:{},profileData:{},userAddresses:[],requirements:[],requirementsSortingOrder:'ascending',searchDistance:20000})

  const reduxDispatch = useDispatch()

  console.log("userState : ",userState)

  useEffect(()=>{   //get app data on first load or on refresh .also user relevant data if user is logged in already
    
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
        <Header/>
        <main>
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
              <Route path='/tutors' element={<TutorsListing/>}></Route>
          </Routes>
        </main>
    </userContext.Provider>
  )
}


