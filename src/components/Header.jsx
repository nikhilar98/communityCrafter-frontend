import { useContext } from "react"
import { userContext } from "../App"
import { Link } from "react-router-dom"
import logo from '../images/cmlogo6.png'

export default function Header() {

    const {userState} = useContext(userContext)

    function handleLogout() { 
        localStorage.removeItem('token')
        userDispatch({type:"LOGOUT_USER"})
      }

    return  ( 
        <header>
            <nav style={{display:"flex",alignItems:'center',justifyContent:"space-between",paddingRight:"20px"}}>
              {
                Object.keys(userState.userDetails).length ?
                  <>
                    <div style={{display:"flex",alignItems:'center',justifyContent:"center"}}>
                      <img src={logo} alt="cmlogo" style={{width:"70px"}}/>
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
        </header>
    )
}