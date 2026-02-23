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
import axios from '../../axios/axios';
import {useFormik} from 'formik'
import * as Yup from 'yup'
import theme from '../../appTheme';
import { Typography, Stack, Divider, InputAdornment, Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';


export default function RegistrationForm() {

   const [serverErrors,setServerErrors] = useState([])
   const navigate = useNavigate()
    
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
        <Box
          onSubmit={formik.handleSubmit}
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            width: { xs: '92vw', sm: '440px', md: '480px' },
            maxWidth: '480px',
            bgcolor: 'background.paper',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}
        >
          {/* Header accent */}
          <Box sx={{
            background: 'linear-gradient(135deg, rgb(51, 102, 122) 0%, rgb(80, 140, 165) 100%)',
            py: 3,
            px: 3,
            textAlign: 'center',
          }}>
            <HowToRegIcon sx={{ fontSize: 40, color: 'rgb(226, 225, 130)', mb: 0.5 }} />
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, letterSpacing: '0.5px' }}>
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.5 }}>
              Join CommunityCrafter today
            </Typography>
          </Box>

          {/* Form body */}
          <Stack spacing={2.5} sx={{ px: { xs: 2.5, sm: 4 }, py: 3.5 }}>
            <TextField
              color="customBlue"
              name="username"
              id="username"
              label="Username"
              type="text"
              value={formik.username}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.username) || Boolean(serverErrors.find(ele=>ele.path=='username'))}
              helperText={(formik.errors.username && formik.errors.username) || (serverErrors.find(ele=>ele.path=='username') && serverErrors.find(ele=>ele.path=='username').msg)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: 'rgb(51, 102, 122)', opacity: 0.7 }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              color="customBlue"
              name="email"
              id="email"
              label="Email Address"
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
              type="password"
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
              }}
            />

            <TextField
              color="customBlue"
              name="phone"
              id="phone"
              label="Phone Number"
              type="tel"
              value={formik.phone}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.phone) || Boolean(serverErrors.find(ele=>ele.path=='phone'))}
              helperText={(formik.errors.phone && formik.errors.phone) || (serverErrors.find(ele=>ele.path=='phone') && serverErrors.find(ele=>ele.path=='phone').msg)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: 'rgb(51, 102, 122)', opacity: 0.7 }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Role selector as styled cards */}
            <FormControl
              color="customBlue"
              error={Boolean(formik.errors.role) || Boolean(serverErrors.find(ele=>ele.path=='role'))}
              sx={{ width: '100%' }}
            >
              <FormLabel sx={{ mb: 1.5, fontWeight: 600, color: 'text.primary' }}>
                Join as
              </FormLabel>
              <RadioGroup
                row
                value={formik.role}
                onChange={formik.handleChange}
                id="role"
                name="role"
                sx={{ gap: 2 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    flex: 1,
                    border: formik.role === 'teacher' ? '2px solid rgb(51, 102, 122)' : '2px solid #e0e0e0',
                    borderRadius: '12px',
                    p: 1.5,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    bgcolor: formik.role === 'teacher' ? 'rgba(51, 102, 122, 0.04)' : 'transparent',
                    '&:hover': { borderColor: 'rgb(51, 102, 122)', bgcolor: 'rgba(51, 102, 122, 0.02)' },
                    textAlign: 'center',
                  }}
                  onClick={() => formik.setFieldValue('role', 'teacher')}
                >
                  <SchoolIcon sx={{ fontSize: 32, color: formik.role === 'teacher' ? 'rgb(51, 102, 122)' : '#999', mb: 0.5 }} />
                  <FormControlLabel
                    value="teacher"
                    control={<Radio sx={{ display: 'none' }} />}
                    label={<Typography variant="body2" sx={{ fontWeight: formik.role === 'teacher' ? 700 : 500 }}>Tutor</Typography>}
                    sx={{ m: 0 }}
                  />
                </Paper>
                <Paper
                  elevation={0}
                  sx={{
                    flex: 1,
                    border: formik.role === 'communityHead' ? '2px solid rgb(51, 102, 122)' : '2px solid #e0e0e0',
                    borderRadius: '12px',
                    p: 1.5,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    bgcolor: formik.role === 'communityHead' ? 'rgba(51, 102, 122, 0.04)' : 'transparent',
                    '&:hover': { borderColor: 'rgb(51, 102, 122)', bgcolor: 'rgba(51, 102, 122, 0.02)' },
                    textAlign: 'center',
                  }}
                  onClick={() => formik.setFieldValue('role', 'communityHead')}
                >
                  <GroupsIcon sx={{ fontSize: 32, color: formik.role === 'communityHead' ? 'rgb(51, 102, 122)' : '#999', mb: 0.5 }} />
                  <FormControlLabel
                    value="communityHead"
                    control={<Radio sx={{ display: 'none' }} />}
                    label={<Typography variant="body2" sx={{ fontWeight: formik.role === 'communityHead' ? 700 : 500 }}>Community Head</Typography>}
                    sx={{ m: 0 }}
                  />
                </Paper>
              </RadioGroup>
              <FormHelperText>{(formik.errors.role && formik.errors.role) || (serverErrors.find(ele=>ele.path=='role') && serverErrors.find(ele=>ele.path=='role').msg)}</FormHelperText>
            </FormControl>

            <Button
              id="submit"
              variant="contained"
              size="large"
              type="submit"
              color="customYellow"
              fullWidth
              sx={{ py: 1.5, fontSize: '1rem' }}
            >
              Create Account
            </Button>

            <Divider sx={{ my: 0.5, '&::before, &::after': { borderColor: 'rgba(0,0,0,0.08)' } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', px: 1 }}>or</Typography>
            </Divider>

            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              Already registered?{' '}
              <Link to='/login' style={{ color: 'rgb(51, 102, 122)', fontWeight: 600, textDecoration: 'none' }}>
                Sign in
              </Link>
            </Typography>
          </Stack>
        </Box>
      </ThemeProvider>
    );
  }