import { useFormik } from "formik"
import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import * as Yup from 'yup'
import { userContext } from "../App"
import { ThemeProvider } from "@emotion/react"
import { Box, Button, Checkbox, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField } from "@mui/material"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import theme from "../appTheme"
import axios from "../axios/axios"
import { toast,ToastContainer } from "react-toastify"


export default function ProfileForm() { 

    const {userState} = useContext(userContext)

    const [bio,setBio] = useState('')
    const [address,setAddress] = useState('')
    const [categoriesSelected,setCategoriesSelected] = useState([])
    const [teachingCategories,setTeachingCategories] = useState([])
    const [files,setFiles] = useState([])
    
    
    console.log(address)
    console.log(categoriesSelected)

    const notify = () => toast.success("Profile saved.");

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

    useEffect(()=>{
        const newState = categoriesSelected.map(ele=>{
            return {categoryId:ele,experience:"",certificates:[]}
        })
        setTeachingCategories(newState)
    },[categoriesSelected])

    console.log("teachingCategories",teachingCategories)

    function handleFileChange (event) { 
            const name = event.target.name
            const uploadedFiles = event.target.files
            setFiles([...files,{name,uploadedFiles}])
    }

    console.log("files :",files)


    async function handleSubmit(e) { 
        e.preventDefault() 
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
            notify()
        }
        catch(err){
            console.log(err)
        }
        
    }

    return ( 
        <div>
            <h1>Create Profile</h1>
        <ThemeProvider theme={theme}>
            <Box 
            backgroundColor="white" 
            borderRadius="20px" 
            padding="20px" 
            width="500px" 
            onSubmit={handleSubmit} 
            component="form" 
            sx={{'& > :not(style)': { m: 1, width: '25ch' }}} 
            noValidate 
            autoComplete="off"
            encType="multipart/form-data">

                <TextField color="customBlue" name="bio" id="bio" label="bio" variant="outlined" type='text' value={bio} onChange={(e)=>{setBio(e.target.value)}} multiline rows={6} helperText="Bio"/><br/>

                <FormControl color="customBlue" variant="standard">
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
                            
                </FormControl><br/>

                <FormControl sx={{ m: 1, width: 300 }}>
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
                </FormControl><br/>

                {
                    categoriesSelected.map((ele,i)=>{
                        return <fieldset key={i} >
                            {
                                console.log(ele)
                            }
                            <h3>{categories.find(cat=>cat._id==ele)?.name}</h3>
                                <label htmlFor={`${ele}_exp`}>Add experience (in years)</label>
                                
                                <input type="number" id={`${ele}_exp`} 
                                    value={teachingCategories.find(el=>el.categoryId==ele.experience)} 
                                    onChange={(e)=>{
                                        const newState = teachingCategories.map(obj=>{
                                        if(obj.categoryId==ele)
                                            return {...obj,experience:e.target.value}
                                        else
                                            return {...obj}
                                        })
                                        setTeachingCategories(newState)
                                    }}/>
                                <br/>

                                <label htmlFor={`${ele}_certificates`}>Add certificates</label>
                                <input type="file" id={`${ele}_certificates`} name={ele} multiple value={undefined} onChange={handleFileChange} />
                        </fieldset>
                    })
                }

            
            <Button id="save_profile" variant="contained" size='large' type='submit' color="customYellow">Save Profile</Button>

            </Box>
            <ToastContainer/>
      </ThemeProvider>
        </div>
    )
}