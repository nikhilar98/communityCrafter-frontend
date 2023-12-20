import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ThemeProvider  } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useContext,  useEffect,  useState } from 'react';
import { userContext } from '../../App';
import theme from '../../appTheme';
import { Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel, InputLabel, ListItemText, MenuItem, OutlinedInput, Radio, RadioGroup, Select } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from '../../axios/axios';
import { toast,ToastContainer } from 'react-toastify';
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
        const [formErrors,setFormErrors] = useState({})
        const {userState,userDispatch} = useContext(userContext)

        const errors = {} 
        const batchSizeRanges = ['1','2-4','5-8','8-12']
        const weekdaysList = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
        const timeValues = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','24:00']
        const categories = useSelector((state)=>{
          return state.categories
        })

        function notify(msg){
          toast.error(msg)
        }

        function runValidations(){ 
          if(!title){
            errors.title= 'title cannot be empty'
          }
          if(!description){
            errors.description = 'description cannot be empty.'
          }
          if(!duration){
            errors.duration = 'duration cannot be empty.'
          }
          if(!pay){
            errors.pay = 'pay cannot be empty.'
          }
          if(!categoryId){
            errors.categoryId = 'categoryId cannot be empty.'
          }
          if(!address){
            errors.address = 'address cannot be empty.'
          }
          if(!batchSizeRange){
            errors.batchSizeRange = 'batchSizeRange cannot be empty.'
          }
          if(!commencementDate){
            errors.commencementDate = 'commencementDate cannot be empty.'
          }
          if(!startTime){
            errors.startTime = 'startTime cannot be empty.'
          }
          if(!endTime){
            errors.endTime = 'endTime cannot be empty.'
          }
          if(weekDays.length<2){
            errors.weekDays = 'Atleast 2 weekdays required'
          }
        }

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

            setServerErrors([])
            runValidations() 

           
            if(Object.keys(errors).length==0){
            
            setFormErrors({})

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
                resetForm()
                navigate('/myRequirements')
            }
            catch(err){
              setServerErrors(err.response.data.errors)
            }

          }
          else { 
            setFormErrors(errors)
          }

        }

        const handleChange = (event) => {
          const {target: { value }} = event;
          setWeekDays(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
          );
        };

        useEffect(()=>{
          if(userState.profileData==null ){
            notify('Please create your profile before creating a requirement.')
          }
          
        },[])

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
            <ToastContainer/>
            <Box backgroundColor="white" borderRadius="20px" padding="20px" width="500px" onSubmit={handleSubmit} component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' }}} noValidate autoComplete="on">
              <h2>Create a requirement</h2>
              {
                userState.profileData && 
              <div style={{display:'grid',gridTemplateColumns:'300px 300px',columnGap:'20px',rowGap:'20px'}}>
             

              <FormControl color="customBlue" variant="standard" error={Boolean(formErrors.address)|| Boolean(serverErrors.find(ele=>ele.path=='address'))}>
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
                            <FormHelperText>{(formErrors.address && formErrors.address) || (serverErrors.find(ele=>ele.path=='address') && serverErrors.find(ele=>ele.path=='address').msg)}</FormHelperText>
                </FormControl><br/>

                <TextField color="customBlue" name="title" id="title" label="title" variant="outlined" type='text' value={title} onChange={(e)=>{setTitle(e.target.value)}} error={Boolean(formErrors.title)|| Boolean(serverErrors.find(ele=>ele.path=='title'))} helperText={(formErrors.title && formErrors.title)|| (serverErrors.find(ele=>ele.path=='title') && serverErrors.find(ele=>ele.path=='title').msg)}/>

                <FormControl error={Boolean(formErrors.categoryId)|| Boolean(serverErrors.find(ele=>ele.path=='categoryId'))}>
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
                  <FormHelperText>{(formErrors.categoryId && formErrors.categoryId)|| (serverErrors.find(ele=>ele.path=='categoryId') && serverErrors.find(ele=>ele.path=='categoryId').msg)}</FormHelperText>
                </FormControl>

              <FormControl  error={Boolean(formErrors.batchSizeRange)|| Boolean(serverErrors.find(ele=>ele.path=='batchSizeRange'))}>
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
                <FormHelperText>{(formErrors.batchSizeRange && formErrors.batchSizeRange)|| (serverErrors.find(ele=>ele.path=='batchSizeRange') && serverErrors.find(ele=>ele.path=='batchSizeRange').msg)}</FormHelperText>
              </FormControl>

              <TextField color="customBlue" name="date" id="date" variant="outlined" type='date' value={commencementDate} onChange={(e)=>{setCommencementDate(e.target.value)}} error={Boolean(formErrors.commencementDate) || Boolean(serverErrors.find(ele=>ele.path=='commencementDate'))} helperText={(formErrors.commencementDate && formErrors.commencementDate) || (serverErrors.find(ele=>ele.path=='commencementDate') && serverErrors.find(ele=>ele.path=='commencementDate').msg) ||"when would you like the classes to commence?"}/>

              <FormControl error={Boolean(formErrors.startTime) || Boolean(serverErrors.find(ele=>ele.path=='desiredTimeSlot'))}>
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
                <FormHelperText>{(formErrors.startTime && formErrors.startTime) || (serverErrors.find(ele=>ele.path=='desiredTimeSlot') && serverErrors.find(ele=>ele.path=='desiredTimeSlot').msg)}</FormHelperText>
              </FormControl>

              <FormControl error={Boolean(formErrors.endTime)|| Boolean(serverErrors.find(ele=>ele.path=='desiredTimeSlot'))}> 
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
                <FormHelperText>{formErrors.endTime && formErrors.endTime}</FormHelperText>
              </FormControl>

              <FormControl error={Boolean(formErrors.weekDays)|| Boolean(serverErrors.find(ele=>ele.path=='weekdays'))}>
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
                    <FormHelperText>{(formErrors.weekDays && formErrors.weekDays)|| (serverErrors.find(ele=>ele.path=='weekdays') && serverErrors.find(ele=>ele.path=='weekdays').msg)}</FormHelperText>
                </FormControl>

              <TextField color="customBlue" name="duration" id="duration" label="duration (in months)" variant="outlined" type='number' value={duration} onChange={(e)=>{setDuration(e.target.value)}} error={Boolean(formErrors.duration)|| Boolean(serverErrors.find(ele=>ele.path=='duration'))} helperText={(formErrors.duration && formErrors.duration)|| (serverErrors.find(ele=>ele.path=='duration') && serverErrors.find(ele=>ele.path=='duration').msg)}/>

              <TextField color="customBlue" name="pay" id="pay" label="Total pay offered (in Rupee)" variant="outlined" type='number'  value={pay} onChange={(e)=>{setPay(e.target.value)}} error={Boolean(formErrors.pay)|| Boolean(serverErrors.find(ele=>ele.path=='payOffered'))} helperText={(formErrors.pay && formErrors.pay)|| (serverErrors.find(ele=>ele.path=='payOffered') && serverErrors.find(ele=>ele.path=='payOffered').msg)}/><br/>

              <TextField color="customBlue" name="description" id="description" label="description" variant="outlined" type='text'  multiline rows={6}  value={description} onChange={(e)=>{setDescription(e.target.value)}} error={Boolean(formErrors.description)|| Boolean(serverErrors.find(ele=>ele.path=='description'))} helperText={(formErrors.description && formErrors.description)|| (serverErrors.find(ele=>ele.path=='description') && serverErrors.find(ele=>ele.path=='description').msg)}/><br/>

              <Button id="submit" variant="contained" size='large' type='submit' color="customYellow">Post requirement</Button>
              </div>
            }
            </Box>
          </ThemeProvider>
        )
      
}