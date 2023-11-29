import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { userContext } from "../App"
import { ThemeProvider } from "@emotion/react"
import { Box, Button, Checkbox, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField, CircularProgress, FormHelperText } from "@mui/material"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import theme from "../appTheme"
import axios from "../axios/axios"
import { Link } from "react-router-dom"


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
    
    
    console.log(address)
    console.log(categoriesSelected)
    console.log(files)

    function runValidations(){
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

    console.log('---------------------------------------',serverErrors)
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


    console.log("teachingCategories",teachingCategories)

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
        runValidations() 

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
                    console.log(response.data)
                    setIsSubmittingForm(false)
                    userDispatch({type:'SET_USER_PROFILE',payload:response.data})
            }
            catch(err){
                    console.log(err)
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
        runValidations() 

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
                    console.log(err)
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
        <div>
            <h1>Create Profile</h1>
        <ThemeProvider theme={theme}>
            <Box 
                backgroundColor="white" 
                borderRadius="20px" 
                padding="20px" 
                width="500px" 
                onSubmit={userState.userDetails.role=='teacher' ? handleSubmitTeacher : handleSubmitCmHead} 
                component="form" 
                sx={{'& > :not(style)': { m: 1, width: '25ch' }}} 
                noValidate 
                autoComplete="off"
                
                encType={userState.userDetails.role=='teacher' ?"multipart/form-data":"application/x-www-form-urlencoded"}
                >

                {   userState.userDetails.role=='teacher' && 
                
                (<>
                <TextField color="customBlue" name="bio" id="bio" label="bio" variant="outlined" type='text' value={bio} onChange={(e)=>{setBio(e.target.value)}} multiline rows={6} error={Boolean(formErrors.bio)|| Boolean(serverErrors.find(ele=>ele.path=='bio'))} helperText={(formErrors.bio && formErrors.bio)||(serverErrors.find(ele=>ele.path=='bio') && serverErrors.find(ele=>ele.path=='bio').msg)||"Bio"}/><br/></>)}

                <FormControl color="customBlue" variant="standard" error={Boolean(formErrors.address)|| Boolean(serverErrors.find(ele=>ele.path=='address'))}>
                            <FormLabel id="addresses">Select an address</FormLabel>
                            <RadioGroup
                            aria-labelledby="addresses"
                            row
                            value={address}
                            onChange={(e)=>{setAddress(e.target.value)}}
                            id="address"
                            name="address"
                            >
                            {
                               userState.userAddresses.map(ele=>{
                                    return <div key={ele._id}>
                                        <FormControlLabel value={ele._id} control={<Radio />} label={`${ele.building}, ${ele.locality}, ${ele.city}, ${ele.state}, ${ele.country} - ${ele.pincode}`}/><hr/>
                                        </div>
                                })
                            }
                            </RadioGroup>
                            <FormHelperText>{(formErrors.address && formErrors.address)||(serverErrors.find(ele=>ele.path=='address') && serverErrors.find(ele=>ele.path=='address').msg)}</FormHelperText>
                </FormControl><br/>
                or <Link to='/address'>Create new Address</Link><br/><br/><br/>

                {userState.userDetails.role=='teacher' && (
                    <>
                    <FormControl sx={{ m: 1, width: 300 }} error={Boolean(formErrors.categoriesSelected)}>
                    <InputLabel id="category-multiple-checkbox">Select a teaching field</InputLabel>
                        <Select
                        labelId="category-multiple-checkbox"
                        id="category-multiple-checkbox"
                        multiple
                        value={categoriesSelected}
                        onChange={handleChange}
                        input={<OutlinedInput label="Select a teaching field" />}
                        renderValue={(selected) =>{
                            // Map selected IDs to their corresponding names
                            const selectedNames = categories
                            .filter((ele) => selected.indexOf(ele._id) > -1)
                            .map((ele) => ele.name);
                    
                            return selectedNames.join(', ');
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
                </FormControl><br/>

                {
                    categoriesSelected.map((ele,i)=>{
                        return <fieldset key={i} >
                                <h3>{categories.find(cat=>cat._id==ele).name}</h3>
                                <label htmlFor={`${ele}_exp`}>Add experience (in years)</label>
                                
                                <input type="number" id={`${ele}_exp`} 
                                    value={teachingCategories.find(el=>el.categoryId==ele)?.experience} 
                                    onChange={(e)=>{handleExperienceChange(e,ele)}}/>
                                <br/>

                                <label htmlFor={`${ele}_certificates`}>Add certificates</label>
                                <input type="file" id={`${ele}_certificates`} name={ele} multiple value={undefined} onChange={handleFileChange} />
                        </fieldset>
                    })
                }
                    <span style={{color:'red'}}>{serverErrors.find(ele=>ele.path=='teachingCategories') && serverErrors.find(ele=>ele.path=='teachingCategories').msg}</span>
                </>
                )}

                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <Button id="save_profile" variant="contained" size='large' type='submit' color="customYellow" disabled={isSubmittingForm}>Save Profile</Button>
                    {isSubmittingForm && <CircularProgress  size={50}/>}
                </div>
                
                
            </Box>
           
      </ThemeProvider>
        </div>
    )
}