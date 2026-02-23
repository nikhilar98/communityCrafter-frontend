import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ThemeProvider  } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from '../../axios/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { ToastContainer, toast } from 'react-toastify';
import { userContext } from '../../App';
import theme from '../../appTheme';
import startSetClasses from '../../actions/classesActions';
import { useDispatch } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography, Stack, Divider, InputAdornment, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function LoginForm() {

    const navigate = useNavigate()
    const [serverErrors,setServerErrors] = useState([])
    const {userDispatch} = useContext(userContext)
    const reduxDispatch = useDispatch()
    const [isLoading,setIsLoading] = useState(false)
    const [showPassword,setShowPassword] = useState(false)
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
          setIsLoading(true)
          const response = await axios.post('/comcraft/login',values)
          localStorage.setItem('token',response.data.token)

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
            reduxDispatch(startSetClasses())
          }
          setServerErrors([])
          setIsLoading(false)
          navigate('/')
        }
        catch(err){
          setIsLoading(false)
          setServerErrors(err.response.data.errors)
        }
          
      }
  })


    return (
      <ThemeProvider theme={theme}>
        <ToastContainer/>
        <Box
          onSubmit={formik.handleSubmit}
          component="form"
          noValidate
          autoComplete="on"
          sx={{
            width: { xs: '92vw', sm: '420px', md: '460px' },
            maxWidth: '460px',
            bgcolor: 'background.paper',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}
        >
          {/* Header accent bar */}
          <Box sx={{
            background: 'linear-gradient(135deg, rgb(51, 102, 122) 0%, rgb(80, 140, 165) 100%)',
            py: 3.5,
            px: 3,
            textAlign: 'center',
          }}>
            <LoginIcon sx={{ fontSize: 40, color: 'rgb(226, 225, 130)', mb: 1 }} />
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, letterSpacing: '0.5px' }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.5 }}>
              Sign in to your account
            </Typography>
          </Box>

          {/* Form body */}
          <Stack spacing={2.5} sx={{ px: { xs: 2.5, sm: 4 }, py: 4 }}>
            <TextField
              color="customBlue"
              name="email"
              id="email"
              label="Email Address"
              variant="outlined"
              type="email"
              value={formik.email}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.email) || Boolean(serverErrors.find(ele=>ele.path=='email'))}
              helperText={(formik.errors.email && formik.errors.email) || (serverErrors.find(ele=>ele.path=='email') && serverErrors.find(ele=>ele.path=='email').msg)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'rgb(51, 102, 122)', opacity: 0.7 }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              color="customBlue"
              name="password"
              id="password"
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={formik.password}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.password) || Boolean(serverErrors.find(ele=>ele.path=='password'))}
              helperText={(formik.errors.password && formik.errors.password) || (serverErrors.find(ele=>ele.path=='password') && serverErrors.find(ele=>ele.path=='password').msg)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'rgb(51, 102, 122)', opacity: 0.7 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          
            <Button
              id="submit"
              variant="contained"
              size="large"
              type="submit"
              color="customYellow"
              disabled={isLoading}
              fullWidth
              sx={{
                py: 1.5,
                fontSize: '1rem',
                position: 'relative',
              }}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: 'rgb(51, 102, 122)' }} /> : 'Login'}
            </Button>

            <Divider sx={{ my: 0.5, '&::before, &::after': { borderColor: 'rgba(0,0,0,0.08)' } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', px: 1 }}>or</Typography>
            </Divider>

            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              New User?{' '}
              <Link to='/register' style={{ color: 'rgb(51, 102, 122)', fontWeight: 600, textDecoration: 'none' }}>
                Create an account
              </Link>
            </Typography>
          </Stack>
        </Box>
      </ThemeProvider>
    );
  }