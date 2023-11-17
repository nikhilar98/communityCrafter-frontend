import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import {ThemeProvider  } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from '../axios/axios';
import {useFormik} from 'formik'
import * as Yup from 'yup'
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

export default function RegistrationForm() {

   const [serverErrors,setServerErrors] = useState([])
   const navigate = useNavigate()
    // async function handleSubmit(e){ 
    //     e.preventDefault()
    //     const formData= { 
    //         username,
    //         email,
    //         password,
    //         phone,
    //         role
    //     }
    //     try{
    //       const response = await axios.post('/comcraft/register',formData)
    //       console.log(response.data)
    //     }
    //     catch(err){
    //       console.log(err)
    //     }
        
    // }
    const userValidationSchema = Yup.object().shape({
      username:Yup.string().required('username is required.'),
      email:Yup.string().required('email is required.').email('Invalid email'),
      password:Yup.string().required('Password is required'),
      phone:Yup.string().required('Phone is required').length(10,'Phone must have 10 digits'),
      role:Yup.string().required('Role is required')
    })

  const formik = useFormik({
      initialValues : {
        username:'',
        email:'',
        password:'',
        phone:'',
        role:''
      },
      validationSchema:userValidationSchema,
      validateOnChange:false,
      validateOnBlur:false,
      onSubmit:async (values)=>{
        try{
          const response = await axios.post('/comcraft/register',values)
          navigate('/login',{state:{msg:response.data.msg}})
          setServerErrors([])
        }
        catch(err){
          setServerErrors(err.response.data.errors)
        }
          
      }
  })

    return (
      <ThemeProvider theme={theme}>
        <Box backgroundColor="white" borderRadius="20px" padding="20px" width="500px" onSubmit={formik.handleSubmit} component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' }}} noValidate autoComplete="off">
          <h2>Register with us</h2>

          <TextField color="customBlue" name="username" id="username" label={formik.errors.username || serverErrors.find(ele=>ele.path=='username')? "Error":"username"} variant="filled" type='text' value={formik.username} onChange={formik.handleChange} error={Boolean(formik.errors.username) || Boolean(serverErrors.find(ele=>ele.path=='username'))} helperText={(formik.errors.username && formik.errors.username) || (serverErrors.find(ele=>ele.path=='username') && serverErrors.find(ele=>ele.path=='username').msg)}/><br/>

          <TextField color="customBlue" name="email" id="email" label={formik.errors.email || serverErrors.find(ele=>ele.path=='email') ? "Error":"email"} variant="filled" type='text' value={formik.email} onChange={formik.handleChange} error={Boolean(formik.errors.email)|| Boolean(serverErrors.find(ele=>ele.path=='email'))} helperText={(formik.errors.email && formik.errors.email) || (serverErrors.find(ele=>ele.path=='email') && serverErrors.find(ele=>ele.path=='email').msg)}/><br/>

          <TextField color="customBlue" name="password" id="password" label={formik.errors.password || serverErrors.find(ele=>ele.path=='password') ? "Error":"password"} variant="filled" type='password' value={formik.password} onChange={formik.handleChange} error={Boolean(formik.errors.password)|| Boolean(serverErrors.find(ele=>ele.path=='password'))} helperText={(formik.errors.password && formik.errors.password) || (serverErrors.find(ele=>ele.path=='password') && serverErrors.find(ele=>ele.path=='password').msg)}/><br/>

          <TextField color="customBlue" name="phone" id="phone" label={formik.errors.phone || serverErrors.find(ele=>ele.path=='phone') ? "Error":"phone"} variant="filled" type='text' value={formik.phone} onChange={formik.handleChange} error={Boolean(formik.errors.phone)|| Boolean(serverErrors.find(ele=>ele.path=='phone'))} helperText={(formik.errors.phone && formik.errors.phone)|| (serverErrors.find(ele=>ele.path=='phone') && serverErrors.find(ele=>ele.path=='phone').msg)}/><br/>

          <FormControl color="customBlue" variant="standard" error={Boolean(formik.errors.role)|| Boolean(serverErrors.find(ele=>ele.path=='role'))}>
            <FormLabel id="roles">What role would you like to join as?</FormLabel>
            <RadioGroup
              aria-labelledby="roles"
              row
              value={formik.role}
              onChange={formik.handleChange}
              id="role"
              name="role"
            >
              <FormControlLabel value="teacher" control={<Radio />} label="Tutor" />
              <FormControlLabel value="communityHead" control={<Radio />} label="Community Head" />
            </RadioGroup>
            <FormHelperText>{(formik.errors.role && formik.errors.role)|| (serverErrors.find(ele=>ele.path=='role') && serverErrors.find(ele=>ele.path=='role').msg)}</FormHelperText>
          </FormControl><br/>
          <Button id="submit" variant="contained" size='large' type='submit' color="customYellow">Register</Button>
          <p>Already registered? <Link to='/login'>Login</Link></p>
        </Box>
      </ThemeProvider>
    );
  }