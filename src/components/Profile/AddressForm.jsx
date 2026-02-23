import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ThemeProvider  } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useMemo, useState } from 'react';
import axios from '../../axios/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { ToastContainer, toast } from 'react-toastify';
import { userContext } from '../../App';
import theme from '../../appTheme';
import { Typography, Stack, Grid, InputAdornment, Container } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import MapIcon from '@mui/icons-material/Map';
import PinDropIcon from '@mui/icons-material/PinDrop';
import PublicIcon from '@mui/icons-material/Public';
import SaveIcon from '@mui/icons-material/Save';

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
        <Container maxWidth="sm" sx={{ py: { xs: 3, md: 5 } }}>
          <Box
            onSubmit={formik.handleSubmit}
            component="form"
            noValidate
            autoComplete="on"
            sx={{
              bgcolor: 'background.paper',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            }}
          >
            {/* Header accent */}
            <Box sx={{
              background: 'linear-gradient(135deg, rgb(51, 102, 122) 0%, rgb(80, 140, 165) 100%)',
              py: 3,
              px: 3,
              textAlign: 'center',
            }}>
              <LocationOnIcon sx={{ fontSize: 40, color: 'rgb(226, 225, 130)', mb: 0.5 }} />
              <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                Add Address
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.5 }}>
                Enter your location details
              </Typography>
            </Box>

            {/* Form body */}
            <Stack spacing={2.5} sx={{ px: { xs: 2.5, sm: 4 }, py: 3.5 }}>
              <TextField
                color="customBlue" name="building" id="building"
                label="Building / House No."
                type="text" value={formik.building} onChange={formik.handleChange}
                error={Boolean(formik.errors.building) || Boolean(serverErrors.find(ele=>ele.path=='building'))}
                helperText={(formik.errors.building && formik.errors.building) || (serverErrors.find(ele=>ele.path=='building') && serverErrors.find(ele=>ele.path=='building').msg)}
                fullWidth
                InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon sx={{ color: 'rgb(51, 102, 122)', opacity: 0.7 }} /></InputAdornment> }}
              />

              <TextField
                color="customBlue" name="locality" id="locality"
                label="Locality / Street"
                type="text" value={formik.locality} onChange={formik.handleChange}
                error={Boolean(formik.errors.locality) || Boolean(serverErrors.find(ele=>ele.path=='locality'))}
                helperText={(formik.errors.locality && formik.errors.locality) || (serverErrors.find(ele=>ele.path=='locality') && serverErrors.find(ele=>ele.path=='locality').msg)}
                fullWidth
                InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon sx={{ color: 'rgb(51, 102, 122)', opacity: 0.7 }} /></InputAdornment> }}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    color="customBlue" name="city" id="city"
                    label="City"
                    type="text" value={formik.city} onChange={formik.handleChange}
                    error={Boolean(formik.errors.city) || Boolean(serverErrors.find(ele=>ele.path=='city'))}
                    helperText={(formik.errors.city && formik.errors.city) || (serverErrors.find(ele=>ele.path=='city') && serverErrors.find(ele=>ele.path=='city').msg)}
                    fullWidth
                    InputProps={{ startAdornment: <InputAdornment position="start"><LocationCityIcon sx={{ color: 'rgb(51, 102, 122)', opacity: 0.7 }} /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    color="customBlue" name="state" id="state"
                    label="State"
                    type="text" value={formik.state} onChange={formik.handleChange}
                    error={Boolean(formik.errors.state) || Boolean(serverErrors.find(ele=>ele.path=='state'))}
                    helperText={(formik.errors.state && formik.errors.state) || (serverErrors.find(ele=>ele.path=='state') && serverErrors.find(ele=>ele.path=='state').msg)}
                    fullWidth
                    InputProps={{ startAdornment: <InputAdornment position="start"><MapIcon sx={{ color: 'rgb(51, 102, 122)', opacity: 0.7 }} /></InputAdornment> }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    color="customBlue" name="pincode" id="pincode"
                    label="Pincode"
                    type="number" value={formik.pincode} onChange={formik.handleChange}
                    error={Boolean(formik.errors.pincode) || Boolean(serverErrors.find(ele=>ele.path=='pincode'))}
                    helperText={(formik.errors.pincode && formik.errors.pincode) || (serverErrors.find(ele=>ele.path=='pincode') && serverErrors.find(ele=>ele.path=='pincode').msg)}
                    fullWidth
                    InputProps={{ startAdornment: <InputAdornment position="start"><PinDropIcon sx={{ color: 'rgb(51, 102, 122)', opacity: 0.7 }} /></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    color="customBlue" name="country" id="country"
                    label="Country"
                    type="text" value={formik.country} onChange={formik.handleChange}
                    error={Boolean(formik.errors.country) || Boolean(serverErrors.find(ele=>ele.path=='country'))}
                    helperText={(formik.errors.country && formik.errors.country) || (serverErrors.find(ele=>ele.path=='country') && serverErrors.find(ele=>ele.path=='country').msg)}
                    fullWidth
                    InputProps={{ startAdornment: <InputAdornment position="start"><PublicIcon sx={{ color: 'rgb(51, 102, 122)', opacity: 0.7 }} /></InputAdornment> }}
                  />
                </Grid>
              </Grid>

              <Button
                id="submit"
                variant="contained"
                size="large"
                type="submit"
                color="customYellow"
                fullWidth
                startIcon={<SaveIcon />}
                sx={{ py: 1.5, fontSize: '1rem', mt: 1 }}
              >
                Save Address
              </Button>
            </Stack>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }