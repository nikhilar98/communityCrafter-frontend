import {Link,Routes,Route} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'

function App() {

  return (
    <div>
       <nav>
            <img src='./src/images/cmlogo6.png' alt="logo" style={{width:"150px"}}/>
            <Link to='/' className='Link'>Home</Link>
            <Link to='/register' className='Link'>Register</Link>
            <Link to='/login' className='Link'>Login</Link>
       </nav>
       <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
       </Routes>
    </div>
  )
}

export default App
