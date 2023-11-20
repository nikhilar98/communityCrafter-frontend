import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ThemeProvider  } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useContext,  useState } from 'react';
import { userContext } from '../App';
import theme from '../appTheme';
import { Checkbox, FormControl, FormControlLabel, FormLabel, InputLabel, ListItemText, MenuItem, OutlinedInput, Radio, RadioGroup, Select } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from '../axios/axios';
export default function RequirementCreate (props){ 
    
        const navigate = useNavigate()
        const [title,setTitle] = useState('')
        const [description,setDescription] = useState("")
        const [duration,setDuration] = useState("")
        const [pay,setPay] = useState("")
        const [categoryId,setCategoryId] = useState("")
        const [address,setAddress] = useState("")
        const [batchSizeRange,setBatchSizeRange] = useState("")
        const [commencementDate,setCommencementDate] = useState("")
        const [startTime,setStartTime] = useState("")
        const [endTime,setEndTime] = useState("")
        const [weekDays,setWeekDays] = useState([])
        const [serverErrors,setServerErrors] = useState([])
        const {userState,userDispatch} = useContext(userContext)

        const batchSizeRanges = ['1','2-4','5-8','8-12']
        const weekdaysList = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
        const timeValues = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','24:00']
        const categories = useSelector((state)=>{
          return state.categories
        })

        function resetForm (){
          setTitle("")
          setDescription("")
          setDuration("")
          setPay("")
          setCategoryId("")
          setAddress("")
          setBatchSizeRange("")
          setCommencementDate("")
          setStartTime("")
          setEndTime("")
          setWeekDays([])
        }

        async function handleSubmit(e) { 
            e.preventDefault() 

            const formData = { 
              title:title,
              categoryId:categoryId,
              batchSizeRange:batchSizeRange,
              payOffered:pay,
              desiredTimeSlot:startTime+'-'+endTime,
              weekdays:weekDays,
              commencementDate:commencementDate,
              duration:duration,
              description:description,
              address:address
            }

            try{
                const response = await axios.post('/comcraft/classRequirement',formData,{
                  headers:{
                    Authorization: localStorage.getItem('token')
                  }
                })
                console.log(response.data)
                resetForm()
            }
            catch(err){
              console.log(err)
            }

        }

        const handleChange = (event) => {
          const {target: { value }} = event;
          setWeekDays(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
          );
        };

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
    
        return (
          <ThemeProvider theme={theme}>
            <Box backgroundColor="white" borderRadius="20px" padding="20px" width="500px" onSubmit={handleSubmit} component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' }}} noValidate autoComplete="on">
              <h2>Create a requirement</h2>
    
              <TextField color="customBlue" name="title" id="title" label="title" variant="outlined" type='text' value={title} onChange={(e)=>{setTitle(e.target.value)}} />

              <FormControl>
                <InputLabel id="category">Select a category</InputLabel>
                <Select
                  labelId="category"
                  label="Select a category"
                  id="category"
                  value={categoryId}
                  onChange={(e)=>{setCategoryId(e.target.value)}}
                >
                  {
                    categories.map(ele=>{
                      return <MenuItem key={ele._id} value={ele._id}>{ele.name}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>


              <FormControl color="customBlue" variant="standard">
                            <FormLabel id="address">Where would you like the classes to be conducted? </FormLabel>
                            <RadioGroup
                            aria-labelledby="address"
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

              <TextField color="customBlue" name="description" id="description" label="description" variant="outlined" type='text'  multiline rows={6}  value={description} onChange={(e)=>{setDescription(e.target.value)}}/>

              <FormControl>
                <InputLabel id="batchSize">Batch Size</InputLabel>
                <Select
                  labelId="batchSize"
                  label="Batch Size"
                  id="batchSize"
                  value={batchSizeRange}
                  onChange={(e)=>{setBatchSizeRange(e.target.value)}}
                >
                  {
                    batchSizeRanges.map((ele,i)=>{
                      return <MenuItem key={i} value={ele}>{ele.split('-').join(' - ')}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel id="startTime">start time</InputLabel>
                <Select
                  labelId="startTime"
                  label="Start time"
                  id="startTime"
                  value={startTime}
                  onChange={(e)=>{setStartTime(e.target.value)}}
                >
                  {
                    timeValues.map((ele,i)=>{
                      return <MenuItem key={i} value={ele}>{ele}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel id="endTime">End time</InputLabel>
                <Select
                  labelId="endTime"
                  label="End time"
                  id="endTime"
                  value={endTime}
                  onChange={(e)=>{setEndTime(e.target.value)}}
                >
                  {
                    timeValues.map((ele,i)=>{
                      return <MenuItem key={i} value={ele}>{ele}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>

              <TextField color="customBlue" name="date" id="date" variant="outlined" type='date' helperText="when would you like the classes to commence?" value={commencementDate} onChange={(e)=>{setCommencementDate(e.target.value)}}/>

              <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="weekdays-multiple-checkbox">class days</InputLabel>
                    <Select
                      labelId="weekdays-multiple-checkbox"
                      id="weekdays-multiple-checkbox"
                      multiple
                      value={weekDays}
                      onChange={handleChange}
                      input={<OutlinedInput label="class days" />}
                      renderValue={(selected) => selected.join(', ')}
                      MenuProps={MenuProps}
                      >
                    {weekdaysList.map((ele,i) => (
                        <MenuItem key={i} value={ele}>
                            <Checkbox checked={weekDays.indexOf(ele) > -1} />
                            <ListItemText primary={ele} />
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl><br/>

              <TextField color="customBlue" name="duration" id="duration" label="duration (in months)" variant="outlined" type='number' value={duration} onChange={(e)=>{setDuration(e.target.value)}}/>

              <TextField color="customBlue" name="pay" id="pay" label="Total pay offered (in Rupee)" variant="outlined" type='number'  value={pay} onChange={(e)=>{setPay(e.target.value)}}/><br/>

    
              <Button id="submit" variant="contained" size='large' type='submit' color="customYellow">Create</Button>
            </Box>
          </ThemeProvider>
        )
      
}