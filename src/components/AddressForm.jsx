import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ThemeProvider  } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useMemo, useState } from 'react';
import axios from '../axios/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { ToastContainer, toast } from 'react-toastify';
import { userContext } from '../App';
import theme from '../appTheme';

export default function AddressForm() {

    const navigate = useNavigate()
    const [serverErrors,setServerErrors] = useState([])
    const {userDispatch} = useContext(userContext)
    
    const addressValidationSchema = Yup.object().shape({
        building:Yup.string().required('buliding is required.'),
        locality:Yup.string().required('locality is required.'),
        city:Yup.string().required('city is required.'),
        state:Yup.string().required('state is required.'),
        pincode:Yup.string().required('pincode is required.'),
        country:Yup.string().required('country is required.')
    })

  const formik = useFormik({
      initialValues : {
        building:'',
        locality:'',
        city:'',
        state:'',
        pincode:'',
        country:'',
      },
      validationSchema:addressValidationSchema,
      validateOnChange:false,
      validateOnBlur:false,
      onSubmit:async (values,{resetForm})=>{
        try{
          const response = await axios.post('/comcraft/address',values,{
            headers:{
                Authorization:localStorage.getItem('token')
            }
          })
          userDispatch({type:"ADD_USER_ADDRESS",payload:response.data})
          resetForm()
          navigate('/profile')
          setServerErrors([])
        }
        catch(err){
          console.log(err)
          setServerErrors(err.response.data.errors)
        }
          
      }
  })

  useMemo(()=>{
    const invalidAddress = serverErrors.find(ele=>ele.path=='invalid address')
    if(invalidAddress){
      toast.error(invalidAddress.msg)
    }
  },[serverErrors])

    return (
      <ThemeProvider theme={theme}>
        <ToastContainer/>
        <Box backgroundColor="white" borderRadius="20px" padding="20px" width="500px" onSubmit={formik.handleSubmit} component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' }}} noValidate autoComplete="on">
          <h2>Create an address</h2>

          <TextField color="customBlue" name="building" id="building" label={formik.errors.building || serverErrors.find(ele=>ele.path=='building') ? "Error":"building"} variant="filled" type='text' value={formik.building} onChange={formik.handleChange} error={Boolean(formik.errors.building)|| Boolean(serverErrors.find(ele=>ele.path=='building'))} helperText={(formik.errors.building && formik.errors.building) || (serverErrors.find(ele=>ele.path=='building') && serverErrors.find(ele=>ele.path=='building').msg)}/><br/>

          <TextField color="customBlue" name="locality" id="locality" label={formik.errors.locality || serverErrors.find(ele=>ele.path=='locality') ? "Error":"locality"} variant="filled" type='text' value={formik.locality} onChange={formik.handleChange} error={Boolean(formik.errors.locality)|| Boolean(serverErrors.find(ele=>ele.path=='locality'))} helperText={(formik.errors.locality && formik.errors.locality) || (serverErrors.find(ele=>ele.path=='locality') && serverErrors.find(ele=>ele.path=='locality').msg)}/><br/>
          
          <TextField color="customBlue" name="city" id="city" label={formik.errors.city || serverErrors.find(ele=>ele.path=='city') ? "Error":"city"} variant="filled" type='text' value={formik.city} onChange={formik.handleChange} error={Boolean(formik.errors.city)|| Boolean(serverErrors.find(ele=>ele.path=='city'))} helperText={(formik.errors.city && formik.errors.city) || (serverErrors.find(ele=>ele.path=='city') && serverErrors.find(ele=>ele.path=='city').msg)}/><br/>

          <TextField color="customBlue" name="state" id="state" label={formik.errors.state || serverErrors.find(ele=>ele.path=='state') ? "Error":"state"} variant="filled" type='text' value={formik.state} onChange={formik.handleChange} error={Boolean(formik.errors.state)|| Boolean(serverErrors.find(ele=>ele.path=='state'))} helperText={(formik.errors.state && formik.errors.state) || (serverErrors.find(ele=>ele.path=='state') && serverErrors.find(ele=>ele.path=='state').msg)}/><br/>

          <TextField color="customBlue" name="pincode" id="pincode" label={formik.errors.pincode || serverErrors.find(ele=>ele.path=='pincode') ? "Error":"pincode"} variant="filled" type='number' value={formik.pincode} onChange={formik.handleChange} error={Boolean(formik.errors.pincode)|| Boolean(serverErrors.find(ele=>ele.path=='pincode'))} helperText={(formik.errors.pincode && formik.errors.pincode) || (serverErrors.find(ele=>ele.path=='pincode') && serverErrors.find(ele=>ele.path=='pincode').msg)}/><br/>

          <TextField color="customBlue" name="country" id="country" label={formik.errors.country || serverErrors.find(ele=>ele.path=='country') ? "Error":"country"} variant="filled" type='text' value={formik.country} onChange={formik.handleChange} error={Boolean(formik.errors.country)|| Boolean(serverErrors.find(ele=>ele.path=='country'))} helperText={(formik.errors.country && formik.errors.country) || (serverErrors.find(ele=>ele.path=='country') && serverErrors.find(ele=>ele.path=='country').msg)}/><br/>


          <Button id="submit" variant="contained" size='large' type='submit' color="customYellow">Save</Button>
        </Box>
      </ThemeProvider>
    );
  }