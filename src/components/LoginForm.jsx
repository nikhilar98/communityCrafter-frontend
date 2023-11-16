import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme,ThemeProvider  } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from '../axios/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { ToastContainer, toast } from 'react-toastify';
import { userContext } from '../App';
import theme from '../appTheme';

// const theme = createTheme({
//   palette: {
//     customYellow: {
//       main: 'rgb(226, 225, 130)',
//     },
//     customBlue: {
//       main: 'rgb(51, 102, 122)',
//     },
//   },
// });

export default function LoginForm() {

    const navigate = useNavigate()
    const [serverErrors,setServerErrors] = useState([])
    const {userState,userDispatch} = useContext(userContext)

    const notify = (msg) => toast.error(msg);

    useEffect(()=>{
      const loginError = serverErrors.find(ele=>ele.path=='loginError')
      if(loginError){
          notify(loginError.msg)
      }
    },[serverErrors])
  
    const userValidationSchema = Yup.object().shape({
      email:Yup.string().required('email is required.').email('Invalid email'),
      password:Yup.string().required('Password is required'),
    })

  const formik = useFormik({
      initialValues : {
        email:'',
        password:'',
      },
      validationSchema:userValidationSchema,
      validateOnChange:false,
      validateOnBlur:false,
      onSubmit:async (values)=>{
        try{
          const response = await axios.post('/comcraft/login',values)
          localStorage.setItem('token',response.data.token)
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
          navigate('/')
          setServerErrors([])
        }
        catch(err){
          console.log(err)
          setServerErrors(err.response.data.errors)
        }
          
      }
  })

    // async function handleSubmit(e){ 
    //     e.preventDefault()
    //     const formData= { 
    //         email,
    //         password,
    //     }
    //     try{
    //       const response = await axios.post('/comcraft/login',formData)
    //       localStorage.setItem('token',response.data.token)
    //     }
    //     catch(err){
    //       console.log(err)
    //     }
        
    // }

    return (
      <ThemeProvider theme={theme}>
        <ToastContainer/>
        <Box backgroundColor="white" borderRadius="20px" padding="20px" width="500px" onSubmit={formik.handleSubmit} component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' }}} noValidate autoComplete="off">
          <h2>Login</h2>

          <TextField color="customBlue" name="email" id="email" label={formik.errors.email || serverErrors.find(ele=>ele.path=='email') ? "Error":"email"} variant="filled" type='text' value={formik.email} onChange={formik.handleChange} error={Boolean(formik.errors.email)|| Boolean(serverErrors.find(ele=>ele.path=='email'))} helperText={(formik.errors.email && formik.errors.email) || (serverErrors.find(ele=>ele.path=='email') && serverErrors.find(ele=>ele.path=='email').msg)}/><br/>

          <TextField color="customBlue" name="password" id="password" label={formik.errors.password || serverErrors.find(ele=>ele.path=='password') ? "Error":"password"} variant="filled" type='password' value={formik.password} onChange={formik.handleChange} error={Boolean(formik.errors.password)|| Boolean(serverErrors.find(ele=>ele.path=='password'))} helperText={(formik.errors.password && formik.errors.password) || (serverErrors.find(ele=>ele.path=='password') && serverErrors.find(ele=>ele.path=='password').msg)}/><br/>
          
          <Button id="submit" variant="contained" size='large' type='submit' color="customYellow">Login</Button>
          <p>New User ? <Link to='/register'>Register</Link></p>
        </Box>
      </ThemeProvider>
    );
  }