import { useContext, useEffect, useState } from "react"
import { userContext } from "../../App"
import axios from "../../axios/axios"
import { ToastContainer, toast } from 'react-toastify';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Map from "../Map/MapContainer";
import { Box, Chip, CircularProgress, Container, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Paper, Select, Slider, Stack, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';

export default function RequirementsList(props) {

    const navigate = useNavigate()
    const { userState, userDispatch } = useContext(userContext)
    const [view, setView] = useState('list')
    const [searchText, setSearchText] = useState('')
    const [pageNo, setPageNo] = useState(1)
    const [isLoading, setisLoading] = useState(true)
    const role = userState.userDetails.role
    const categories = useSelector((state) => {
        return state.categories
    })

    const notify = (msg) => { toast.error(msg) }

    function handleChange(e) {
        setView(e.target.value)
    }
    const handlePageChange = (event, value) => {
        setPageNo(value);
    };

    const filteredRequirements = userState.requirements.filter(ele => ele.title.includes(searchText))

    useEffect(() => {
        (async function () {
            try {
                if (role == 'teacher') {
                    const requirements = await axios.get(`/comcraft/classRequirements/pending?sortOrder=${userState.requirementsSortingOrder}&searchDistance=${userState.searchDistance}`, {
                        headers: {
                            Authorization: localStorage.getItem('token')
                        }
                    })
                    setisLoading(false)
                    userDispatch({ type: "SET_USER_REQUIREMENTS", payload: requirements.data })
                    setPageNo(1)

                }
                else if (role == 'communityHead') {
                    const requirements = await axios.get(`/comcraft/classRequirements?sortOrder=${userState.requirementsSortingOrder}`, {
                        headers: {
                            Authorization: localStorage.getItem('token')
                        }
                    })
                    setisLoading(false)
                    userDispatch({ type: "SET_USER_REQUIREMENTS", payload: requirements.data })
                    setPageNo(1)

                }
            }
            catch (err) {
                notify(err.response.data.errors[0].msg)
            }

        })()
    }, [role, userState.requirementsSortingOrder, userState.searchDistance])

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
            <ToastContainer />

            {/* Page header */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'rgb(51, 102, 122)', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                        {role == 'communityHead' ? 'My Requirements' : 'Requirements Available'}
                    </Typography>
                    {role == 'teacher' && (
                        <ToggleButtonGroup
                            color="primary"
                            value={view}
                            exclusive
                            onChange={handleChange}
                            aria-label="requirements-view"
                            size="small"
                            sx={{
                                '& .MuiToggleButton-root': {
                                    borderRadius: '8px',
                                    px: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                },
                                '& .Mui-selected': {
                                    bgcolor: 'rgb(51, 102, 122) !important',
                                    color: '#fff !important',
                                },
                            }}
                        >
                            <ToggleButton value='list'>List View</ToggleButton>
                            <ToggleButton value='map'>Map View</ToggleButton>
                        </ToggleButtonGroup>
                    )}
                </Box>
            </Box>

            {(userState.profileData && userState.requirements.length == 0) && (
                <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: '16px', border: '1px dashed #ccc' }}>
                    <Typography variant="body1" color="text.secondary">
                        {role == 'communityHead' ? 'No requirements created' : 'No new requirements available in your set search area.'}
                    </Typography>
                </Paper>
            )}

            {/* Filters */}
            {view == 'list' && (
                <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={5}>
                            <TextField
                                size="small"
                                fullWidth
                                placeholder="Search by keyword..."
                                value={searchText}
                                onChange={(e) => { setSearchText(e.target.value) }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'rgb(51,102,122)' }} /></InputAdornment>
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl size="small" fullWidth>
                                <InputLabel id="sortOrder-label">Sort by date</InputLabel>
                                <Select
                                    labelId="sortOrder-label"
                                    label="Sort by date"
                                    value={userState.requirementsSortingOrder}
                                    onChange={(e) => { userDispatch({ type: 'SET_LIST_SORT_ORDER', payload: e.target.value }) }}
                                    startAdornment={<InputAdornment position="start"><SortIcon sx={{ color: 'rgb(51,102,122)' }} /></InputAdornment>}
                                >
                                    <MenuItem value="ascending">Oldest first</MenuItem>
                                    <MenuItem value="descending">Latest first</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Distance slider for teachers */}
            {role == 'teacher' && (
                <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        Showing requirements within <strong>{userState.searchDistance / 1000} km</strong> from your location
                    </Typography>
                    <Slider
                        aria-label="distance"
                        value={userState.searchDistance}
                        onChange={(e) => { userDispatch({ type: 'SET_SEARCH_DISTANCE', payload: e.target.value }) }}
                        step={5000}
                        min={1000}
                        max={51000}
                        sx={{
                            color: 'rgb(51, 102, 122)',
                            maxWidth: 400,
                            '& .MuiSlider-thumb': { '&:hover': { boxShadow: '0 0 0 8px rgba(51, 102, 122, 0.16)' } },
                        }}
                    />
                </Paper>
            )}

            {/* Loading */}
            {(isLoading && userState.profileData) && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={50} />
                </Box>
            )}

            {/* List or Map */}
            {view == 'list' ? (
                <Stack spacing={2}>
                    {filteredRequirements.slice(pageNo * 3 - 3, pageNo * 3).map(ele => (
                        <Paper
                            key={ele._id}
                            elevation={0}
                            sx={{
                                p: { xs: 2, sm: 2.5 },
                                borderRadius: '14px',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                transition: 'all 0.2s ease',
                                '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.1)', transform: 'translateY(-2px)' },
                                cursor: 'pointer',
                            }}
                            onClick={() => { navigate(`/requirement/${ele._id}`) }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: 'rgb(51, 102, 122)' }}>
                                    {ele.title}
                                </Typography>
                                {role == 'communityHead' ? (
                                    <Chip
                                        label={ele.status}
                                        size="small"
                                        sx={{
                                            bgcolor: ele.status == 'pending' ? 'rgba(255,152,0,0.12)' : 'rgba(76,175,80,0.12)',
                                            color: ele.status == 'pending' ? '#e65100' : '#2e7d32',
                                            fontWeight: 600,
                                        }}
                                    />
                                ) : (
                                    ele.proposals.find(p => p == userState.userDetails._id) && (
                                        <Chip label="Proposal Sent" size="small" sx={{ bgcolor: 'rgba(255,152,0,0.12)', color: '#e65100', fontWeight: 600 }} />
                                    )
                                )}
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {categories.find(cat => cat._id == ele.categoryId)?.name} &bull; {ele.duration} months
                            </Typography>
                            <Button size="small" sx={{ color: 'rgb(51,102,122)', fontWeight: 600, p: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>
                                View Details
                            </Button>
                        </Paper>
                    ))}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Pagination
                            count={Math.ceil(filteredRequirements.length / 3)}
                            page={pageNo}
                            onChange={handlePageChange}
                            sx={{
                                '& .MuiPaginationItem-root.Mui-selected': {
                                    bgcolor: 'rgb(51, 102, 122)',
                                    color: '#fff',
                                },
                            }}
                        />
                    </Box>
                </Stack>
            ) : (
                <>
                    {(role == 'teacher' && userState.profileData?.address && categories) &&
                        <Paper elevation={0} sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                            <Map teacherLocation={userState.profileData.address?.location.coordinates.reverse()} requirements={userState.requirements} categories={categories} />
                        </Paper>
                    }
                </>
            )}
        </Container>
    )
}