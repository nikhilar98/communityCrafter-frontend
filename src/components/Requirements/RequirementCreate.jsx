import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { userContext } from '../../App';
import theme from '../../appTheme';
import { Checkbox, Chip, Container, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, InputAdornment, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Radio, RadioGroup, Select, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from '../../axios/axios';
import { toast, ToastContainer } from 'react-toastify';
import PostAddIcon from '@mui/icons-material/PostAdd';
import TitleIcon from '@mui/icons-material/Title';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimerIcon from '@mui/icons-material/Timer';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DescriptionIcon from '@mui/icons-material/Description';
import SendIcon from '@mui/icons-material/Send';

export default function RequirementCreate(props) {

  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState("")
  const [pay, setPay] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [address, setAddress] = useState("")
  const [batchSizeRange, setBatchSizeRange] = useState("")
  const [commencementDate, setCommencementDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [weekDays, setWeekDays] = useState([])
  const [serverErrors, setServerErrors] = useState([])
  const [formErrors, setFormErrors] = useState({})
  const { userState, userDispatch } = useContext(userContext)

  const errors = {}
  const batchSizeRanges = ['1', '2-4', '5-8', '8-12']
  const weekdaysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const timeValues = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
  const categories = useSelector((state) => {
    return state.categories
  })

  function notify(msg) {
    toast.error(msg)
  }

  function runValidations() {
    if (!title) {
      errors.title = 'title cannot be empty'
    }
    if (!description) {
      errors.description = 'description cannot be empty.'
    }
    if (!duration) {
      errors.duration = 'duration cannot be empty.'
    }
    if (!pay) {
      errors.pay = 'pay cannot be empty.'
    }
    if (!categoryId) {
      errors.categoryId = 'categoryId cannot be empty.'
    }
    if (!address) {
      errors.address = 'address cannot be empty.'
    }
    if (!batchSizeRange) {
      errors.batchSizeRange = 'batchSizeRange cannot be empty.'
    }
    if (!commencementDate) {
      errors.commencementDate = 'commencementDate cannot be empty.'
    }
    if (!startTime) {
      errors.startTime = 'startTime cannot be empty.'
    }
    if (!endTime) {
      errors.endTime = 'endTime cannot be empty.'
    }
    if (weekDays.length < 2) {
      errors.weekDays = 'Atleast 2 weekdays required'
    }
  }

  function resetForm() {
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

    if (Object.keys(errors).length == 0) {

      setFormErrors({})

      const formData = {
        title: title,
        categoryId: categoryId,
        batchSizeRange: batchSizeRange,
        payOffered: pay,
        desiredTimeSlot: startTime + '-' + endTime,
        weekdays: weekDays,
        commencementDate: commencementDate,
        duration: duration,
        description: description,
        address: address
      }

      try {
        const response = await axios.post('/comcraft/classRequirement', formData, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        resetForm()
        navigate('/myRequirements')
      }
      catch (err) {
        setServerErrors(err.response.data.errors)
      }

    }
    else {
      setFormErrors(errors)
    }

  }

  const handleChange = (event) => {
    const { target: { value } } = event;
    setWeekDays(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  useEffect(() => {
    if (userState.profileData == null) {
      notify('Please create your profile before creating a requirement.')
    }

  }, [])

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
      <ToastContainer />
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          }}
        >
          {/* Header */}
          <Box sx={{
            background: 'linear-gradient(135deg, rgb(51, 102, 122) 0%, rgb(80, 140, 165) 100%)',
            py: 3,
            px: 3,
            textAlign: 'center',
          }}>
            <PostAddIcon sx={{ fontSize: 40, color: 'rgb(226, 225, 130)', mb: 0.5 }} />
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
              Create a Requirement
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.5 }}>
              Describe what you need and find the perfect tutor
            </Typography>
          </Box>

          {/* Form body */}
          <Box
            onSubmit={handleSubmit}
            component="form"
            noValidate
            autoComplete="on"
            sx={{ px: { xs: 2.5, sm: 4 }, py: 3.5 }}
          >
            {userState.profileData && (
              <Stack spacing={3}>
                {/* Address selection */}
                <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e0e0e0', borderRadius: '12px' }}>
                  <FormControl
                    color="customBlue"
                    variant="standard"
                    error={Boolean(formErrors.address) || Boolean(serverErrors.find(ele => ele.path == 'address'))}
                    sx={{ width: '100%' }}
                  >
                    <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
                      Where would you like the classes to be conducted?
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="address"
                      value={address}
                      onChange={(e) => { setAddress(e.target.value) }}
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
                    <FormHelperText>{(formErrors.address && formErrors.address) || (serverErrors.find(ele => ele.path == 'address') && serverErrors.find(ele => ele.path == 'address').msg)}</FormHelperText>
                  </FormControl>
                </Paper>

                {/* Title */}
                <TextField
                  color="customBlue"
                  name="title"
                  id="title"
                  label="Requirement Title"
                  variant="outlined"
                  type="text"
                  fullWidth
                  value={title}
                  onChange={(e) => { setTitle(e.target.value) }}
                  error={Boolean(formErrors.title) || Boolean(serverErrors.find(ele => ele.path == 'title'))}
                  helperText={(formErrors.title && formErrors.title) || (serverErrors.find(ele => ele.path == 'title') && serverErrors.find(ele => ele.path == 'title').msg)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><TitleIcon sx={{ color: 'rgb(51,102,122)' }} /></InputAdornment>
                  }}
                />

                {/* Category + Batch Size row */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={Boolean(formErrors.categoryId) || Boolean(serverErrors.find(ele => ele.path == 'categoryId'))}
                    >
                      <InputLabel id="category">Category</InputLabel>
                      <Select
                        labelId="category"
                        label="Category"
                        id="category"
                        value={categoryId}
                        onChange={(e) => { setCategoryId(e.target.value) }}
                        startAdornment={<InputAdornment position="start"><CategoryIcon sx={{ color: 'rgb(51,102,122)' }} /></InputAdornment>}
                      >
                        {categories.map(ele => (
                          <MenuItem key={ele._id} value={ele._id}>{ele.name}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{(formErrors.categoryId && formErrors.categoryId) || (serverErrors.find(ele => ele.path == 'categoryId') && serverErrors.find(ele => ele.path == 'categoryId').msg)}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={Boolean(formErrors.batchSizeRange) || Boolean(serverErrors.find(ele => ele.path == 'batchSizeRange'))}
                    >
                      <InputLabel id="batchSize">Batch Size</InputLabel>
                      <Select
                        labelId="batchSize"
                        label="Batch Size"
                        id="batchSize"
                        value={batchSizeRange}
                        onChange={(e) => { setBatchSizeRange(e.target.value) }}
                        startAdornment={<InputAdornment position="start"><GroupIcon sx={{ color: 'rgb(51,102,122)' }} /></InputAdornment>}
                      >
                        {batchSizeRanges.map((ele, i) => (
                          <MenuItem key={i} value={ele}>{ele.split('-').join(' - ')}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{(formErrors.batchSizeRange && formErrors.batchSizeRange) || (serverErrors.find(ele => ele.path == 'batchSizeRange') && serverErrors.find(ele => ele.path == 'batchSizeRange').msg)}</FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Commencement Date */}
                <TextField
                  color="customBlue"
                  name="date"
                  id="date"
                  label="Commencement Date"
                  variant="outlined"
                  type="date"
                  fullWidth
                  value={commencementDate}
                  onChange={(e) => { setCommencementDate(e.target.value) }}
                  error={Boolean(formErrors.commencementDate) || Boolean(serverErrors.find(ele => ele.path == 'commencementDate'))}
                  helperText={(formErrors.commencementDate && formErrors.commencementDate) || (serverErrors.find(ele => ele.path == 'commencementDate') && serverErrors.find(ele => ele.path == 'commencementDate').msg) || "When would you like the classes to commence?"}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><CalendarMonthIcon sx={{ color: 'rgb(51,102,122)' }} /></InputAdornment>
                  }}
                />

                {/* Time slot row */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={Boolean(formErrors.startTime) || Boolean(serverErrors.find(ele => ele.path == 'desiredTimeSlot'))}
                    >
                      <InputLabel id="startTime">Start Time</InputLabel>
                      <Select
                        labelId="startTime"
                        label="Start Time"
                        id="startTime"
                        value={startTime}
                        onChange={(e) => { setStartTime(e.target.value) }}
                        startAdornment={<InputAdornment position="start"><AccessTimeIcon sx={{ color: 'rgb(51,102,122)' }} /></InputAdornment>}
                      >
                        {timeValues.map((ele, i) => (
                          <MenuItem key={i} value={ele}>{ele}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{(formErrors.startTime && formErrors.startTime) || (serverErrors.find(ele => ele.path == 'desiredTimeSlot') && serverErrors.find(ele => ele.path == 'desiredTimeSlot').msg)}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={Boolean(formErrors.endTime) || Boolean(serverErrors.find(ele => ele.path == 'desiredTimeSlot'))}
                    >
                      <InputLabel id="endTime">End Time</InputLabel>
                      <Select
                        labelId="endTime"
                        label="End Time"
                        id="endTime"
                        value={endTime}
                        onChange={(e) => { setEndTime(e.target.value) }}
                        startAdornment={<InputAdornment position="start"><AccessTimeIcon sx={{ color: 'rgb(51,102,122)' }} /></InputAdornment>}
                      >
                        {timeValues.map((ele, i) => (
                          <MenuItem key={i} value={ele}>{ele}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{formErrors.endTime && formErrors.endTime}</FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Weekdays */}
                <FormControl
                  fullWidth
                  error={Boolean(formErrors.weekDays) || Boolean(serverErrors.find(ele => ele.path == 'weekdays'))}
                >
                  <InputLabel id="weekdays-multiple-checkbox">Class Days</InputLabel>
                  <Select
                    labelId="weekdays-multiple-checkbox"
                    id="weekdays-multiple-checkbox"
                    multiple
                    value={weekDays}
                    onChange={handleChange}
                    input={<OutlinedInput label="Class Days" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((val) => (
                          <Chip key={val} label={val} size="small" sx={{ bgcolor: 'rgba(51, 102, 122, 0.1)', color: 'rgb(51, 102, 122)', fontWeight: 500 }} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {weekdaysList.map((ele, i) => (
                      <MenuItem key={i} value={ele}>
                        <Checkbox checked={weekDays.indexOf(ele) > -1} />
                        <ListItemText primary={ele} />
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{(formErrors.weekDays && formErrors.weekDays) || (serverErrors.find(ele => ele.path == 'weekdays') && serverErrors.find(ele => ele.path == 'weekdays').msg)}</FormHelperText>
                </FormControl>

                {/* Duration + Pay row */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      color="customBlue"
                      name="duration"
                      id="duration"
                      label="Duration (months)"
                      variant="outlined"
                      type="number"
                      fullWidth
                      value={duration}
                      onChange={(e) => { setDuration(e.target.value) }}
                      error={Boolean(formErrors.duration) || Boolean(serverErrors.find(ele => ele.path == 'duration'))}
                      helperText={(formErrors.duration && formErrors.duration) || (serverErrors.find(ele => ele.path == 'duration') && serverErrors.find(ele => ele.path == 'duration').msg)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><TimerIcon sx={{ color: 'rgb(51,102,122)' }} /></InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      color="customBlue"
                      name="pay"
                      id="pay"
                      label="Total Pay Offered"
                      variant="outlined"
                      type="number"
                      fullWidth
                      value={pay}
                      onChange={(e) => { setPay(e.target.value) }}
                      error={Boolean(formErrors.pay) || Boolean(serverErrors.find(ele => ele.path == 'payOffered'))}
                      helperText={(formErrors.pay && formErrors.pay) || (serverErrors.find(ele => ele.path == 'payOffered') && serverErrors.find(ele => ele.path == 'payOffered').msg)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon sx={{ color: 'rgb(51,102,122)' }} /></InputAdornment>
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Description */}
                <TextField
                  color="customBlue"
                  name="description"
                  id="description"
                  label="Description"
                  variant="outlined"
                  type="text"
                  fullWidth
                  multiline
                  rows={5}
                  value={description}
                  onChange={(e) => { setDescription(e.target.value) }}
                  error={Boolean(formErrors.description) || Boolean(serverErrors.find(ele => ele.path == 'description'))}
                  helperText={(formErrors.description && formErrors.description) || (serverErrors.find(ele => ele.path == 'description') && serverErrors.find(ele => ele.path == 'description').msg) || "Describe what you're looking for in detail"}
                  InputProps={{
                    startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><DescriptionIcon sx={{ color: 'rgb(51,102,122)' }} /></InputAdornment>
                  }}
                />

                {/* Submit */}
                <Button
                  id="submit"
                  variant="contained"
                  size="large"
                  type="submit"
                  color="customYellow"
                  fullWidth
                  endIcon={<SendIcon />}
                  sx={{ py: 1.5, fontSize: '1rem', mt: 1 }}
                >
                  Post Requirement
                </Button>
              </Stack>
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )

}