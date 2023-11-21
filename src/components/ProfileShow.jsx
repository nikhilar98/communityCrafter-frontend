import { useState,useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "../axios/axios"
import { Card, CardContent, CardMedia, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import _ from 'lodash'


export default function ProfileShow(){

    const {tutorId} = useParams()
    const [profile,setProfile] = useState({})
    const categories = useSelector((state)=>{
        return state.categories
    })

    useEffect(()=>{
        (async function(){
            try{
                const userProfile = await axios.get(`/comcraft/user/${tutorId}`)
                console.log(userProfile.data)
                setProfile(userProfile.data)
            }
            catch(err){
                console.log(err)
            }
        })()
    },[])
    
    return (
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
        </div>
        }
        </div>
    )
}