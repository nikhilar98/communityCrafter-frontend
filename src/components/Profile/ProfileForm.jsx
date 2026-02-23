import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { userContext } from "../../App"
import { ThemeProvider } from "@emotion/react"
import { Box, Button, Checkbox, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField, CircularProgress, FormHelperText, Typography, Stack, Container, Paper, Chip, Grid } from "@mui/material"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import theme from "../../appTheme"
import axios from "../../axios/axios"
import { Link } from "react-router-dom"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';


export default function ProfileForm() { 

    const {userState,userDispatch} = useContext(userContext)

    const [bio,setBio] = useState('')
    const [address,setAddress] = useState('')
    const [categoriesSelected,setCategoriesSelected] = useState([])
    const [teachingCategories,setTeachingCategories] = useState([])
    const [files,setFiles] = useState([])
    const [isSubmittingForm,setIsSubmittingForm] = useState(false)
    const [serverErrors,setServerErrors] = useState([])
    const [formErrors,setFormErrors] = useState({})
    const errors= {} 
    

    function runValidationsTeacher(){
        if(!bio){
            errors.bio = 'bio is required'
        }
        if(!address){ 
            errors.address = 'address is required'  
        }
        if(categoriesSelected.length==0){
            errors.categoriesSelected = 'Atleast 1 Category required.'
        }
    }
    function runValidationsCmHead(){
      
        if(!address){ 
            errors.address = 'address is required'  
        }
       
    }

    const categories= useSelector((state)=>{
        return state.categories
    })

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        },
    },
    };

    const handleChange = (event) => {
        const {
          target: { value },
        } = event;
        setCategoriesSelected(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };


    const handleFileChange = (event) => { 
            const name = event.target.name
            const uploadedFiles = event.target.files
            setFiles([...files,{name,uploadedFiles}])
    }

    const handleExperienceChange =  (e,categoryId) => { 
        
            const newState = teachingCategories.map(obj=>{
                if(obj.categoryId==categoryId)
                    return {...obj,experience:e.target.value}
                else
                    return {...obj}
            })
            setTeachingCategories(newState)
        
    }

    async function handleSubmitCmHead(e){
        e.preventDefault()
        setServerErrors([])
        runValidationsCmHead() 

        if(Object.keys(errors).length==0){
            setFormErrors({})

            setIsSubmittingForm(true) 
            const formData = { 
                address
            }
            try{
                    const response = await axios.post('/comcraft/communityHead/createProfile',formData,{
                        headers:{
                            Authorization : localStorage.getItem('token')
                        }
                    })
                    setIsSubmittingForm(false)
                    userDispatch({type:'SET_USER_PROFILE',payload:response.data})
            }
            catch(err){
                    setIsSubmittingForm(false)
                    setServerErrors(err.response.data.errors)
            }

     }
     else { 
        setFormErrors(errors)
     }
        
    }


    async function handleSubmitTeacher(e) { 
        e.preventDefault() 

        setServerErrors([])
        runValidationsTeacher() 

        if(Object.keys(errors).length==0){
                setFormErrors({})

                setIsSubmittingForm(true)
                const formData = new FormData() 

                formData.append('bio',bio)
                formData.append('address',address)
                formData.append('teachingCategories',JSON.stringify(teachingCategories))
                
                files.forEach((obj)=>{
                    Object.values(obj.uploadedFiles).forEach((file)=>{
                        formData.append(obj.name,file)
                    })
                })
            
                try{
                    const response = await axios.post('/comcraft/teacher/createProfile',formData,{
                        headers:{
                            'Content-Type' : "multipart/form-data",
                            Authorization : localStorage.getItem('token')
                        }
                    })
                    setIsSubmittingForm(false)
                    userDispatch({type:'SET_USER_PROFILE',payload:response.data})
                }
                catch(err){
                    setIsSubmittingForm(false)
                    setServerErrors(err.response.data.errors)
                }
        }
        else { 
            setFormErrors(errors)
        }
        
        
    }

    useEffect(()=>{
        const newState = categoriesSelected.map(ele=>{
            const alreadyPopulatedCategory = teachingCategories.find(cat=>cat.categoryId==ele)
            if(alreadyPopulatedCategory){
                return {...alreadyPopulatedCategory}
            }
            else{
                return {categoryId:ele,experience:"",certificates:[]}
            }
           
        })
        setTeachingCategories(newState)
    },[categoriesSelected])  //reason why experience is resetting to empry string when a new category is selected 

    return ( 
        <ThemeProvider theme={theme}>
          <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
            <Box
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
                <AccountCircleIcon sx={{ fontSize: 40, color: 'rgb(226, 225, 130)', mb: 0.5 }} />
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                  Create Profile
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.5 }}>
                  {userState.userDetails.role === 'teacher' ? 'Set up your tutor profile' : 'Set up your community profile'}
                </Typography>
              </Box>

              {/* Form body */}
              <Box
                onSubmit={userState.userDetails.role=='teacher' ? handleSubmitTeacher : handleSubmitCmHead} 
                component="form" 
                noValidate 
                autoComplete="off"
                encType={userState.userDetails.role=='teacher' ?"multipart/form-data":"application/x-www-form-urlencoded"}
                sx={{ px: { xs: 2.5, sm: 4 }, py: 3.5 }}
              >
                <Stack spacing={3}>
                  {/* Bio section for teachers */}
                  {userState.userDetails.role=='teacher' && (
                    <TextField
                      color="customBlue"
                      name="bio"
                      id="bio"
                      label="Tell us about yourself"
                      variant="outlined"
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      multiline
                      rows={5}
                      error={Boolean(formErrors.bio) || Boolean(serverErrors.find(ele=>ele.path=='bio'))}
                      helperText={(formErrors.bio && formErrors.bio) || (serverErrors.find(ele=>ele.path=='bio') && serverErrors.find(ele=>ele.path=='bio').msg) || "Write a brief bio about your teaching experience"}
                      fullWidth
                    />
                  )}

                  {/* Address selection */}
                  <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e0e0e0', borderRadius: '12px' }}>
                    <FormControl 
                      color="customBlue" 
                      variant="standard" 
                      error={Boolean(formErrors.address) || Boolean(serverErrors.find(ele=>ele.path=='address'))}
                      sx={{ width: '100%' }}
                    >
                      <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
                        Select an address
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="addresses"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        id="address"
                        name="address"
                      >
                        {userState.userAddresses.map(ele => (
                          <Paper
                            key={ele._id}
                            elevation={0}
                            sx={{
                              mb: 1,
                              p: 1.5,
                              borderRadius: '10px',
                              border: address === ele._id ? '2px solid rgb(51, 102, 122)' : '1px solid #e8e8e8',
                              bgcolor: address === ele._id ? 'rgba(51, 102, 122, 0.04)' : 'transparent',
                              transition: 'all 0.2s ease',
                              cursor: 'pointer',
                              '&:hover': { borderColor: 'rgb(51, 102, 122)', bgcolor: 'rgba(51, 102, 122, 0.02)' },
                            }}
                            onClick={() => setAddress(ele._id)}
                          >
                            <FormControlLabel
                              value={ele._id}
                              control={<Radio size="small" />}
                              label={
                                <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                                  {`${ele.building}, ${ele.locality}, ${ele.city}, ${ele.state}, ${ele.country} - ${ele.pincode}`}
                                </Typography>
                              }
                              sx={{ m: 0, width: '100%' }}
                            />
                          </Paper>
                        ))}
                      </RadioGroup>
                      <FormHelperText>{(formErrors.address && formErrors.address) || (serverErrors.find(ele=>ele.path=='address') && serverErrors.find(ele=>ele.path=='address').msg)}</FormHelperText>
                    </FormControl>
                    <Box sx={{ mt: 1.5 }}>
                      <Button
                        component={Link}
                        to="/address"
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        sx={{
                          borderColor: 'rgb(51, 102, 122)',
                          color: 'rgb(51, 102, 122)',
                          borderRadius: '8px',
                          '&:hover': { borderColor: 'rgb(35, 75, 92)', bgcolor: 'rgba(51, 102, 122, 0.04)' },
                        }}
                      >
                        Create new Address
                      </Button>
                    </Box>
                  </Paper>

                  {/* Teaching categories for teachers */}
                  {userState.userDetails.role=='teacher' && (
                    <>
                      <FormControl sx={{ width: '100%' }} error={Boolean(formErrors.categoriesSelected)}>
                        <InputLabel id="category-multiple-checkbox">Select teaching fields</InputLabel>
                        <Select
                          labelId="category-multiple-checkbox"
                          id="category-multiple-checkbox"
                          multiple
                          value={categoriesSelected}
                          onChange={handleChange}
                          input={<OutlinedInput label="Select teaching fields" />}
                          renderValue={(selected) => {
                            const selectedNames = categories
                              .filter((ele) => selected.indexOf(ele._id) > -1)
                              .map((ele) => ele.name);
                            return (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selectedNames.map((name) => (
                                  <Chip key={name} label={name} size="small" sx={{ bgcolor: 'rgba(51, 102, 122, 0.1)', color: 'rgb(51, 102, 122)', fontWeight: 500 }} />
                                ))}
                              </Box>
                            );
                          }}
                          MenuProps={MenuProps}
                        >
                          {categories.map((ele) => (
                            <MenuItem key={ele._id} value={ele._id}>
                              <Checkbox checked={categoriesSelected.indexOf(ele._id) > -1} />
                              <ListItemText primary={ele.name} />
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{(formErrors.categoriesSelected && formErrors.categoriesSelected)}</FormHelperText>
                      </FormControl>

                      {/* Category detail cards */}
                      {categoriesSelected.map((ele, i) => (
                        <Paper
                          key={i}
                          elevation={0}
                          sx={{
                            p: 2.5,
                            border: '1px solid #e0e0e0',
                            borderRadius: '12px',
                            bgcolor: 'rgba(248, 249, 250, 0.5)',
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'rgb(51, 102, 122)' }}>
                            {categories.find(cat => cat._id == ele)?.name}
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                label="Experience (years)"
                                type="number"
                                size="small"
                                fullWidth
                                value={teachingCategories.find(el => el.categoryId == ele)?.experience}
                                onChange={(e) => handleExperienceChange(e, ele)}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Button
                                variant="outlined"
                                component="label"
                                startIcon={<UploadFileIcon />}
                                fullWidth
                                sx={{
                                  py: 1,
                                  borderColor: '#ccc',
                                  color: 'text.secondary',
                                  borderStyle: 'dashed',
                                  '&:hover': { borderColor: 'rgb(51, 102, 122)', color: 'rgb(51, 102, 122)', bgcolor: 'rgba(51, 102, 122, 0.02)' },
                                }}
                              >
                                Upload Certificates
                                <input type="file" name={ele} multiple hidden onChange={handleFileChange} />
                              </Button>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}

                      {serverErrors.find(ele => ele.path == 'teachingCategories') && (
                        <Typography variant="body2" sx={{ color: 'rgb(243, 73, 60)' }}>
                          {serverErrors.find(ele => ele.path == 'teachingCategories').msg}
                        </Typography>
                      )}
                    </>
                  )}

                  {/* Submit */}
                  <Button
                    id="save_profile"
                    variant="contained"
                    size="large"
                    type="submit"
                    color="customYellow"
                    disabled={isSubmittingForm}
                    fullWidth
                    startIcon={isSubmittingForm ? null : <SaveIcon />}
                    sx={{ py: 1.5, fontSize: '1rem', mt: 1 }}
                  >
                    {isSubmittingForm ? <CircularProgress size={24} sx={{ color: 'rgb(51, 102, 122)' }} /> : 'Save Profile'}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
    )
}