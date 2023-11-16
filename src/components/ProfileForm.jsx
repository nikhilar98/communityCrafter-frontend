import { useFormik } from "formik"
import { useContext, useState } from "react"
import { useSelector } from "react-redux"
import * as Yup from 'yup'
import { userContext } from "../App"
import { ThemeProvider } from "@emotion/react"
import { Box, Checkbox, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField } from "@mui/material"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import theme from "../appTheme"

export default function ProfileForm() { 

    const {userState} = useContext(userContext)

    const [bio,setBio] = useState('')
    const [address,setAddress] = useState('')
    const [categoriesSelected,setCategoriesSelected] = useState([])

    console.log(categoriesSelected)

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

    function handleSubmit() { 

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
            autoComplete="off">

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
                                    return <FormControlLabel key={ele._id} value={ele._id} control={<Radio />} label={`${ele.building}, ${ele.locality}, ${ele.city}, ${ele.state}, ${ele.country} - ${ele.pincode}`}/>
                                })
                            }
                            </RadioGroup>
                            {/* <FormHelperText>{(formik.errors.role && formik.errors.role)|| (serverErrors.find(ele=>ele.path=='role') && serverErrors.find(ele=>ele.path=='role').msg)}</FormHelperText> */}
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
                </FormControl>

                {
                    categoriesSelected.map((ele,i)=>{
                        return <fieldset>
                            <h3>{ele.name}</h3>
                            <form>
                                <label htmlFor={`${ele._id}_exp`}>Add experience (in years)</label>
                                <input type="number" id={`${ele._id}_exp`} /><br/>
                                <label htmlFor={`${ele._id}_certificates`}>Add certificates</label>
                                <input type="file" id={`${ele._id}_certificates`}/>
                            </form>
                        </fieldset>
                    })
                }

            
            
            {/* <Button id="submit" variant="contained" size='large' type='submit' color="customYellow">Login</Button> */}
            </Box>
      </ThemeProvider>
        </div>
    )
}