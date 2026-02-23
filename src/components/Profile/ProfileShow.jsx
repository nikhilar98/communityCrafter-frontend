import { useState, useEffect, useRef, useContext } from "react"
import { useParams } from "react-router-dom"
import axios from "../../axios/axios"
import { Box, Button, Card, CardContent, CardMedia, Container, Divider, Grid, Paper, Rating, Stack, TextField, ThemeProvider, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import _ from 'lodash'
import theme from "../../appTheme"
import { userContext } from "../../App"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CircularProgress from '@mui/material/CircularProgress';


export default function ProfileShow() {

    const { tutorId } = useParams()
    const { userState } = useContext(userContext)
    const [profile, setProfile] = useState({})
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [teacherReviews, setTeacherReviews] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [editReviewId, setEditReviewId] = useState('')
    const commentArea = useRef()


    const categories = useSelector((state) => {
        return state.categories
    })

    const handleEditComment = async (reviewId) => {
        setIsEdit(true)
        setEditReviewId(reviewId)
        const review = teacherReviews.find(ele => ele._id == reviewId)
        setRating(review.rating)
        setComment(review.reviewText)
        commentArea.current.focus()
    }

    const handleDeleteComment = async (reviewId) => {
        const confirmDelete = confirm('Are you sure you want to delete this comment? ')
        if (confirmDelete) {
            const response = await axios.delete(`/comcraft/teacherReview/${reviewId}`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            setTeacherReviews(teacherReviews.filter(ele => ele._id !== response.data._id))
        }
    }

    const handleChange = (event, newValue) => {
        setRating(newValue);
    }

    async function handleEditSubmit(e) {
        e.preventDefault()

        const formData = {
            rating: rating,
            reviewText: comment
        }

        try {
            const response = await axios.put(`/comcraft/teacherReview/${editReviewId}`, formData, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            setTeacherReviews(teacherReviews.map(ele => {
                if (ele._id == response.data._id) {
                    return { ...ele, rating: response.data.rating, reviewText: response.data.reviewText }
                }
                else {
                    return { ...ele }
                }
            }))
            setRating(0)
            setComment('')
            setIsEdit(false)
            setEditReviewId('')
        }
        catch (err) {
            console.log(err)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const formData = {
            rating: rating,
            reviewText: comment
        }

        try {
            const response = await axios.post(`/comcraft/teacherReview/${tutorId}`, formData, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            setTeacherReviews([...teacherReviews, response.data])
            setRating(0)
            setComment('')
        }
        catch (err) {
            console.log(err)
        }

    }

    useEffect(() => {
        (async function () {
            try {
                const userProfile = await axios.get(`/comcraft/user/${tutorId}`)
                setProfile(userProfile.data)
                const userReviews = await axios.get(`/comcraft/teacherReview/${tutorId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
                setTeacherReviews(userReviews.data)
            }
            catch (err) {
                console.log(err)
            }
        })()
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
                {_.isEmpty(profile) ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress size={50} />
                    </Box>
                ) : (
                    <Stack spacing={3}>
                        {/* Contact Details Card */}
                        <Paper elevation={0} sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                            <Box sx={{ background: 'linear-gradient(135deg, rgb(51, 102, 122) 0%, rgb(80, 140, 165) 100%)', py: 2.5, px: 3 }}>
                                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                                    <PersonIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'rgb(226, 225, 130)' }} />
                                    Tutor Profile
                                </Typography>
                            </Box>
                            <Box sx={{ p: { xs: 2, sm: 3 } }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <PersonIcon sx={{ color: 'rgb(51, 102, 122)' }} />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Username</Typography>
                                                <Typography variant="body1" fontWeight={600}>{profile.user?.username}</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <EmailIcon sx={{ color: 'rgb(51, 102, 122)' }} />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Email</Typography>
                                                <Typography variant="body1" fontWeight={600}>{profile.user?.email}</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <PhoneIcon sx={{ color: 'rgb(51, 102, 122)' }} />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Phone</Typography>
                                                <Typography variant="body1" fontWeight={600}>{profile.user?.phone}</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>

                        {/* Bio & Address */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={7}>
                                <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: 'rgb(51, 102, 122)' }}>
                                        <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />About
                                    </Typography>
                                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>{profile.bio}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: 'rgb(51, 102, 122)' }}>
                                        <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Address
                                    </Typography>
                                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                                        {`${profile.address?.building}, ${profile.address?.locality}, ${profile.address?.city}, ${profile.address?.state}, ${profile.address?.country} - ${profile.address?.pincode}`}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Teaching Categories */}
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'rgb(51, 102, 122)' }}>
                            <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Teaching Categories
                        </Typography>
                        <Grid container spacing={2}>
                            {profile.teachingCategories?.map(ele => (
                                <Grid item xs={12} md={6} key={ele._id}>
                                    <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: 'rgb(51, 102, 122)' }}>
                                            {categories.find(category => category._id == ele.categoryId)?.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                            Experience: {ele.experience} years
                                        </Typography>
                                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Certificates</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                            {ele.certificates.map((cert, i) => (
                                                <CardMedia
                                                    key={cert._id}
                                                    component="img"
                                                    sx={{
                                                        width: { xs: '100%', sm: '180px' },
                                                        height: 'auto',
                                                        borderRadius: '10px',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                    }}
                                                    src={cert.url}
                                                    alt={`certificate-${i + 1}`}
                                                />
                                            ))}
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Reviews Section */}
                        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'rgb(51, 102, 122)' }}>
                                <RateReviewIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Reviews
                            </Typography>
                            <Box sx={{ maxHeight: '400px', overflow: 'auto', mb: 3 }}>
                                {teacherReviews.length === 0 && (
                                    <Typography variant="body2" color="text.secondary">No reviews yet. Be the first to review!</Typography>
                                )}
                                <Stack spacing={2}>
                                    {teacherReviews.map((ele, i) => (
                                        <Paper
                                            key={i}
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                borderRadius: '12px',
                                                border: '1px solid #e8e8e8',
                                                transition: 'box-shadow 0.2s',
                                                '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    {ele.creator.username}
                                                </Typography>
                                                {userState.userDetails._id == ele.creator._id && (
                                                    <Box>
                                                        <EditIcon
                                                            sx={{ fontSize: 18, cursor: 'pointer', color: 'rgb(51, 102, 122)', mr: 1, '&:hover': { color: 'rgb(80, 140, 165)' } }}
                                                            onClick={() => { handleEditComment(ele._id) }}
                                                        />
                                                        <DeleteIcon
                                                            sx={{ fontSize: 18, cursor: 'pointer', color: '#d32f2f', '&:hover': { color: '#f44336' } }}
                                                            onClick={() => { handleDeleteComment(ele._id) }}
                                                        />
                                                    </Box>
                                                )}
                                            </Box>
                                            <Rating name="disabled" value={ele.rating} readOnly size="small" />
                                            <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                                                {ele.reviewText}
                                            </Typography>
                                        </Paper>
                                    ))}
                                </Stack>
                            </Box>

                            <Divider sx={{ mb: 2 }} />
                            <Box onSubmit={isEdit ? handleEditSubmit : handleSubmit} component="form" noValidate autoComplete="off">
                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                                    {isEdit ? 'Edit your review' : 'Write a review'}
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    value={comment}
                                    onChange={(e) => { setComment(e.target.value) }}
                                    fullWidth
                                    multiline
                                    rows={2}
                                    placeholder="Share your experience..."
                                    inputRef={commentArea}
                                    sx={{ mb: 1.5 }}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                    <Rating value={rating} onChange={handleChange} />
                                    <Button
                                        variant="contained"
                                        color={isEdit ? 'customGreen' : "customYellow"}
                                        type="submit"
                                        sx={{ px: 3 }}
                                    >
                                        {isEdit ? 'Update Review' : 'Submit Review'}
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Stack>
                )}
            </Container>
        </ThemeProvider>
    )
}