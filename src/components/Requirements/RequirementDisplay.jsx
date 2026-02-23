import { useContext, useEffect, useState } from "react"
import { userContext } from "../../App"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { Button, Card, CardContent, Chip, Container, Divider, Grid, Paper, Stack, Typography, Modal, Box } from "@mui/material"
import axios from "../../axios/axios"
import { ToastContainer, toast } from 'react-toastify';
import { ThemeProvider } from "@emotion/react"
import theme from "../../appTheme"
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimerIcon from '@mui/icons-material/Timer';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90vw', sm: 400 },
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: '20px',
    boxShadow: 24,
    p: 4,
};

export default function RequirementDisplay(props) {

    const [open, setOpen] = useState(false)
    const [confirm, setConfirm] = useState(false)

    const { id } = useParams()
    const { userState, userDispatch } = useContext(userContext)
    const navigate = useNavigate()
    const notify = (msg) => { toast.success(msg) }

    const requirement = userState.requirements.find(ele => ele._id == id)
    const category = useSelector((state) => {
        return state.categories.find(ele => ele._id == requirement?.categoryId)
    })

    const alreadyProposed = () => { return requirement?.proposals.find(ele => ele == userState.userDetails._id) }

    function handleAcceptProposal() {
        setOpen(true)
    }

    async function confirmProposal(tutorId) {
        try {
            const stripeResponse = await axios.post(`/comcraft/checkout`, { payOffered: requirement.payOffered, requirementId: requirement._id, paymentStatus: 'pending' }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            localStorage.setItem('transactionId', stripeResponse.data.id)
            localStorage.setItem('requirement', JSON.stringify(requirement))
            localStorage.setItem('tutorId', tutorId)
            window.location = stripeResponse.data.url
        }
        catch (err) {
            console.log(err)
        }
    }

    async function handleAcceptRequirement() {
        try {
            const response = await axios.put(`/comcraft/classRequirement/${id}`, null, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            userDispatch({ type: 'UPDATE_USER_REQUIREMENT', payload: response.data.requirement })
            notify(response.data.msg)
        }
        catch (err) {
            console.log(err)
        }
    }

    const DetailRow = ({ icon, label, value }) => (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1 }}>
            {icon}
            <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Typography>
                <Typography variant="body1">{value}</Typography>
            </Box>
        </Box>
    )

    return (
        requirement ? (
            <ThemeProvider theme={theme}>
                <ToastContainer />
                <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                    <Stack spacing={3}>
                        {/* Header */}
                        <Paper elevation={0} sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                            <Box sx={{ background: 'linear-gradient(135deg, rgb(51, 102, 122) 0%, rgb(80, 140, 165) 100%)', py: 3, px: { xs: 2, sm: 3 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                    <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                                        {requirement?.title}
                                    </Typography>
                                    {userState.userDetails.role == 'communityHead' && (
                                        <Chip
                                            label={requirement.status}
                                            sx={{
                                                bgcolor: requirement.status == 'pending' ? 'rgba(255,152,0,0.2)' : 'rgba(76,175,80,0.2)',
                                                color: requirement.status == 'pending' ? '#ff9800' : '#4caf50',
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                                px: 1,
                                            }}
                                        />
                                    )}
                                </Box>
                                <Chip label={category?.name} size="small" sx={{ mt: 1, bgcolor: 'rgba(226, 225, 130, 0.2)', color: 'rgb(226, 225, 130)', fontWeight: 600 }} />
                            </Box>

                            {/* Details Grid */}
                            <Box sx={{ p: { xs: 2, sm: 3 } }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <DetailRow icon={<LocationOnIcon sx={{ color: 'rgb(51,102,122)', mt: 0.3 }} />} label="Address" value={`${requirement?.address.building}, ${requirement?.address.locality}, ${requirement?.address.city}, ${requirement?.address.state}, ${requirement?.address.country}, ${requirement?.address.pincode}`} />
                                        <DetailRow icon={<GroupIcon sx={{ color: 'rgb(51,102,122)', mt: 0.3 }} />} label="Batch Size" value={requirement?.batchSizeRange} />
                                        <DetailRow icon={<CurrencyRupeeIcon sx={{ color: 'rgb(51,102,122)', mt: 0.3 }} />} label="Pay Offered" value={`₹${requirement?.payOffered}`} />
                                        <DetailRow icon={<CalendarMonthIcon sx={{ color: 'rgb(51,102,122)', mt: 0.3 }} />} label="Weekdays" value={requirement?.weekdays.join(", ")} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <DetailRow icon={<AccessTimeIcon sx={{ color: 'rgb(51,102,122)', mt: 0.3 }} />} label="Time Slot" value={requirement?.desiredTimeSlot} />
                                        <DetailRow icon={<CalendarMonthIcon sx={{ color: 'rgb(51,102,122)', mt: 0.3 }} />} label="Commencement" value={new Date(requirement?.commencementDate).toDateString()} />
                                        <DetailRow icon={<TimerIcon sx={{ color: 'rgb(51,102,122)', mt: 0.3 }} />} label="Duration" value={`${requirement?.duration} months`} />
                                    </Grid>
                                </Grid>
                                <Divider sx={{ my: 2 }} />
                                <DetailRow icon={<DescriptionIcon sx={{ color: 'rgb(51,102,122)', mt: 0.3 }} />} label="Description" value={requirement?.description} />
                            </Box>
                        </Paper>

                        {/* Proposals / Confirmed Tutor (Community Head) */}
                        {userState.userDetails.role == 'communityHead' && (
                            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                                {requirement?.confirmedTeacherId ? (
                                    <>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'rgb(51,102,122)' }}>
                                            <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#4caf50' }} />Confirmed Tutor
                                        </Typography>
                                        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '2px solid #4caf50', bgcolor: 'rgba(76,175,80,0.04)' }}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} sm={4}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <PersonIcon sx={{ color: 'rgb(51,102,122)' }} />
                                                        <Typography fontWeight={600}>{requirement?.confirmedTeacherId.username}</Typography>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <EmailIcon sx={{ color: 'rgb(51,102,122)' }} />
                                                        <Typography>{requirement?.confirmedTeacherId.email}</Typography>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Button variant="contained" color="customYellow" onClick={() => { navigate(`/tutor/${requirement?.confirmedTeacherId._id}`) }}>
                                                        Visit Profile
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'rgb(51,102,122)' }}>
                                            Proposals from Tutors
                                        </Typography>
                                        {requirement?.proposals.length == 0 ? (
                                            <Typography variant="body1" color="text.secondary">No proposals yet!</Typography>
                                        ) : (
                                            <Stack spacing={1.5}>
                                                {requirement?.proposals.map((ele, i) => (
                                                    <Paper key={i} elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e0e0e0', transition: 'all 0.2s', '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' } }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                                            <Typography fontWeight={600}>{ele.username}</Typography>
                                                            <Stack direction="row" spacing={1}>
                                                                <Button variant="outlined" size="small" sx={{ borderColor: 'rgb(51,102,122)', color: 'rgb(51,102,122)' }} onClick={() => { navigate(`/tutor/${ele._id}`) }}>View Profile</Button>
                                                                <Button variant="contained" color="customGreen" size="small" onClick={handleAcceptProposal}>Accept</Button>
                                                            </Stack>
                                                        </Box>
                                                        <Modal open={open} onClose={() => { setOpen(false) }}>
                                                            <Box sx={modalStyle}>
                                                                <Typography variant="h6" fontWeight={700}>Confirmation</Typography>
                                                                <Typography sx={{ mt: 2, mb: 2 }}>Are you sure you want to proceed with this tutor?</Typography>
                                                                <Stack direction="row" spacing={2}>
                                                                    <Button variant="contained" color="customGreen" onClick={() => { confirmProposal(ele._id) }}>Confirm</Button>
                                                                    <Button variant="outlined" color="customRed" onClick={() => { setOpen(false) }}>Cancel</Button>
                                                                </Stack>
                                                            </Box>
                                                        </Modal>
                                                    </Paper>
                                                ))}
                                            </Stack>
                                        )}
                                    </>
                                )}
                            </Paper>
                        )}

                        {/* Contact Info */}
                        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'rgb(51,102,122)' }}>Contact Info</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <PersonIcon sx={{ color: 'rgb(51,102,122)' }} />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Username</Typography>
                                            <Typography fontWeight={600}>{requirement?.creator.username}</Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <EmailIcon sx={{ color: 'rgb(51,102,122)' }} />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Email</Typography>
                                            <Typography fontWeight={600}>{requirement?.creator.email}</Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <PhoneIcon sx={{ color: 'rgb(51,102,122)' }} />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Phone</Typography>
                                            <Typography fontWeight={600}>{requirement?.creator.phone}</Typography>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Teacher proposal action */}
                        {userState.userDetails.role == 'teacher' && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', pb: 3 }}>
                                {alreadyProposed() ? (
                                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', bgcolor: 'rgba(255,152,0,0.06)', border: '1px solid rgba(255,152,0,0.3)', textAlign: 'center' }}>
                                        <Typography fontWeight={600}>
                                            You have sent a proposal. Please wait patiently for the response. <span style={{ color: 'rgb(226, 225, 130)' }}>ruko zara, sabar karo!</span>
                                        </Typography>
                                    </Paper>
                                ) : (
                                    <Button variant="contained" size="large" endIcon={<SendIcon />} onClick={handleAcceptRequirement}
                                        sx={{ px: 5, py: 1.5, fontSize: '1rem', borderRadius: '12px' }}>
                                        Send Proposal
                                    </Button>
                                )}
                            </Box>
                        )}
                    </Stack>
                </Container>
            </ThemeProvider>
        ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={50} />
            </Box>
        )
    )
}