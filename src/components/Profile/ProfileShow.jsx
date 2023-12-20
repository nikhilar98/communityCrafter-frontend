import { useState,useEffect, useRef, useContext } from "react"
import { useParams } from "react-router-dom"
import axios from "../../axios/axios"
import { Box, Button, Card, CardContent, CardMedia, Rating, TextField, ThemeProvider, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import _ from 'lodash'
import theme from "../../appTheme"
import { userContext } from "../../App"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


export default function ProfileShow(){

    const {tutorId} = useParams()
    const {userState} = useContext(userContext)
    const [profile,setProfile] = useState({})
    const [rating,setRating] = useState(0)
    const [comment,setComment] = useState('')
    const [teacherReviews,setTeacherReviews] = useState([])
    const [isEdit,setIsEdit] = useState(false)
    const [editReviewId,setEditReviewId] = useState('')
    const commentArea = useRef()
   

    const categories = useSelector((state)=>{
        return state.categories
    })

    const handleEditComment = async (reviewId) => { 
        setIsEdit(true)
        setEditReviewId(reviewId)
        const review = teacherReviews.find(ele=>ele._id==reviewId)
        setRating(review.rating)
        setComment(review.reviewText)
        commentArea.current.focus()
    }

    const handleDeleteComment = async (reviewId) => { 
        const confirmDelete = confirm('Are you sure you want to delete this comment? ')
        if(confirmDelete){
            const response = await axios.delete(`/comcraft/teacherReview/${reviewId}`,{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            })
            setTeacherReviews(teacherReviews.filter(ele=>ele._id!==response.data._id))
        }
    }

    const handleChange = (event, newValue) => {
        setRating(newValue);
    }

    async function handleEditSubmit(e){
        e.preventDefault()
        
        const formData = { 
            rating:rating,
            reviewText:comment
        }

        try{
            const response= await axios.put(`/comcraft/teacherReview/${editReviewId}`,formData,{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            })
            setTeacherReviews(teacherReviews.map(ele=>{
                if(ele._id==response.data._id){
                    return {...ele,rating:response.data.rating,reviewText:response.data.reviewText}
                }
                else {
                    return {...ele}
                }
            }))
            setRating(0)
            setComment('')
            setIsEdit(false)
            setEditReviewId('')
        }
        catch(err){
            console.log(err)
        }
    }

    async function handleSubmit(e){
        e.preventDefault()

        const formData = { 
            rating:rating,
            reviewText:comment
        }

        try{
            const response= await axios.post(`/comcraft/teacherReview/${tutorId}`,formData,{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            })
            setTeacherReviews([...teacherReviews,response.data])
            setRating(0)
            setComment('')
        }
        catch(err){
            console.log(err)
        }

    }

    useEffect(()=>{
        (async function(){
            try{
                const userProfile = await axios.get(`/comcraft/user/${tutorId}`)
                setProfile(userProfile.data)
                const userReviews = await axios.get(`/comcraft/teacherReview/${tutorId}`,{
                    headers:{
                        Authorization:localStorage.getItem('token')
                    }
                })
                setTeacherReviews(userReviews.data)
            }
            catch(err){
                console.log(err)
            }
        })()
    },[])
    
    return (
        <ThemeProvider theme={theme}>
        <div>
            { _.isEmpty(profile) ? <p>Loading...</p> :
            <div style={{paddingLeft:"20px"}}>
            <Card variant="outlined" sx={{ maxWidth: 1200,mb: 1.5,backgroundColor:'rgb(242, 243, 243)',marginTop:'20px' }}>
                <CardContent>
                                    <Typography variant="h4" color="text.secondary" gutterBottom>
                                      Contact Details
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }}>
                                       username : {profile.user?.username}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }}>
                                        email : {profile.user?.email} 
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }}>
                                        phone : {profile.user?.phone}
                                    </Typography>
                                    
                </CardContent>
            </Card>
            <h2>Bio</h2>
            <p>{profile.bio}</p>
            <h2>Address</h2>
            <p>{`${profile.address?.building}, ${profile.address?.locality}, ${profile.address?.city}, ${profile.address?.state}, ${profile.address?.country} - ${profile.address?.pincode}`}</p>
            <h2>Teaching categories</h2>
            {
                profile.teachingCategories?.map(ele=>{
                    return  <Card variant="outlined" sx={{ maxWidth: 1200,mb: 1.5,backgroundColor:'rgb(242, 243, 243)' }} key={ele._id}>
                                <CardContent>
                                    <Typography variant="h4" color="text.secondary" gutterBottom>
                                        {categories.find(category=>category._id==ele.categoryId)?.name}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }}>
                                        Experience: {ele.experience} years
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }}>
                                        Certificates 
                                    </Typography>
                                    <div style={{display:"flex"}}>
                                    {
                                        ele.certificates.map((ele,i)=>{
                                            return <CardMedia
                                                    key={ele._id}
                                                    component="img"
                                                    sx={{width:"250px",margin:"10px"}}
                                                    src={ele.url}
                                                    alt={`certificate-${i+1}`}
                                                    />
                                            // return <span key={i}><img src={ele.url} alt={`certificate-${i+1}`} style={{width:"500px",margin:"10px"}}/></span>
                                        })
                                    }
                                    </div>
                                </CardContent>
                            </Card>
                   
                })
            }
            <h2>reviews</h2>  
                <ul style={{height:'300px',overflow:'auto',width:'900px',padding:'20px'}}>
                {
                    teacherReviews.map((ele,i)=>{
                        return <div key={i} style={{marginBottom:'20px',boxShadow:'2px 2px 5px 1px',width:'500px',padding:'5px',borderRadius:'6px'}}>
                                    <Box>
                                        <div style={{display:'flex',justifyContent:'space-between'}}>
                                            <Typography variant="subtitle2">
                                                {ele.creator.username} 
                                            </Typography>
                                            {userState.userDetails._id==ele.creator._id && <span><EditIcon className="img-button" onClick={()=>{handleEditComment(ele._id)}}/><DeleteIcon onClick={()=>{handleDeleteComment(ele._id)}} className="img-button"/></span>}
                                        </div>
                                        <Rating name="disabled" value={ele.rating} readOnly size="small"/>
                                    </Box>
                                    <Typography variant="caption" >
                                        {ele.reviewText}
                                    </Typography>
                                </div>
                    })
                }  
                </ul> 
                <Box onSubmit={isEdit ? handleEditSubmit :  handleSubmit } component="form" noValidate sx={{mb:'50px'}} autoComplete="off"> 
                    <TextField variant="outlined" value={comment} onChange={(e)=>{setComment(e.target.value)}} sx={{width:'800px'}} placeholder="Your review" inputRef={commentArea}/><br/>
                    <Rating value={rating} onChange={handleChange}/><br/><br/>
                    <Button variant="contained" color={isEdit ? 'customGreen':"customYellow" }type='submit'>{isEdit ? 'edit review':'add review'}</Button>
                </Box>
            
            
        </div>
        }
        </div>
        </ThemeProvider>
    )
}