import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { createTheme,ThemeProvider  } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from '../axios/axios';

const theme = createTheme({
  palette: {
    customYellow: {
      main: 'rgb(226, 225, 130)',
    },
    customBlue: {
      main: 'rgb(51, 102, 122)',
    },
  },
});

export default function LoginForm() {

   
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    async function handleSubmit(e){ 
        e.preventDefault()
        const formData= { 
            email,
            password,
        }
        try{
          const response = await axios.post('/comcraft/login',formData)
          console.log(response.data)
        }
        catch(err){
          console.log(err)
        }
        
    }

    return (
      <ThemeProvider theme={theme}>
        <Box backgroundColor="white" borderRadius="20px" padding="20px" width="500px" onSubmit={handleSubmit} component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' }}} noValidate autoComplete="off">
          <h2>Login</h2>
          
          <TextField color="customBlue" id="email" label="email" variant="filled" type='text' value={email} onChange={(e)=>{setEmail(e.target.value)}}/><br/>
          <TextField color="customBlue" id="password" label="password" variant="filled" type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}}/><br/>
          <Button id="submit" variant="contained" size='large' type='submit' color="customYellow">Login</Button>
          <p>New User ? <Link to='/register'>Register</Link></p>
        </Box>
      </ThemeProvider>
    );
  }