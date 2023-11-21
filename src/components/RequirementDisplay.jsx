import { useContext, useEffect, useState } from "react"
import { userContext } from "../App"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { Button, Card, CardContent, Typography } from "@mui/material"
import axios from "../axios/axios"
import { ToastContainer, toast } from 'react-toastify';
import { ThemeProvider } from "@emotion/react"
import theme from "../appTheme"

export default function RequirementDisplay (props){ 

        const {id} = useParams()
        const {userState,userDispatch} = useContext(userContext)
        const navigate = useNavigate()
        const notify = (msg) =>  {toast.success(msg)}

        const requirement = userState.requirements.find(ele=>ele._id==id)
        const category = useSelector((state)=>{
                        return state.categories.find(ele=>ele._id==requirement?.categoryId)
                    })
        
        const alreadyProposed = () => { return requirement?.proposals.find(ele=>ele==userState.userDetails._id)}
        
        async function handleAcceptProposal(tutorId){ 
            const accept = confirm('Are you sure?')
            if(accept){
                   try{
                        const response = await axios.put(`/comcraft/classRequirement/${id}`,{userId:tutorId},{
                            headers:{
                                Authorization: localStorage.getItem('token')
                            }
                        })
                        userDispatch({type:'UPDATE_USER_REQUIREMENT',payload:response.data.requirement})
                   }
                   catch(err){
                        console.log(err)
                   }
            }
        }
                    
        async function handleAcceptRequirement(){
            try{
                const response = await axios.put(`/comcraft/classRequirement/${id}`,null,{
                    headers:{
                        Authorization: localStorage.getItem('token')
                    }
                })
                userDispatch({type:'UPDATE_USER_REQUIREMENT',payload:response.data.requirement})
                notify(response.data.msg)
            }
            catch(err) { 
                console.log(err)
            }
        }
                   

    return ( 
      requirement ?  <ThemeProvider theme={theme}><div style={{marginLeft:20}}>
            <ToastContainer/>
            <div style={{display:"flex",justifyContent:"space-between"}}>
                <h1>{requirement?.title}</h1> 
                {userState.userDetails.role=='communityHead' && <p style={{marginRight:30,color:requirement.status=='pending' ? 'red' : 'green'}}>Status : {requirement.status}</p>} 
            </div>
            <h2>Category : {category.name}</h2>
            <p><strong>Community address :</strong> {requirement?.address.building}, {requirement?.address.locality}, {requirement?.address.city}, {requirement?.address.state}, {requirement?.address.country}, {requirement?.address.pincode}</p>
            <p><strong>batch size range :</strong> {requirement?.batchSizeRange}</p>
            <p><strong>Pay offered :</strong> &#8377;{requirement?.payOffered}</p>
            <p><strong>weekdays : </strong> {requirement?.weekdays.join(", ")}</p>
            <p><strong>Desired Time slot :</strong> {requirement?.desiredTimeSlot}</p>
            <p><strong>Commencement Date :</strong> {new Date(requirement?.commencementDate).toDateString()}</p>
            <p><strong>Duration :</strong> {requirement?.duration} months</p>
            <p><strong>Description :</strong> {requirement?.description}</p><br /><br />

            {
                 userState.userDetails.role=='communityHead' && 
                 (  <>
                     {
                     requirement?.confirmedTeacherId ? 
                        <div>
                            <h3>Confirmed Tutor details</h3>
                            <Card variant="outlined" sx={{ maxWidth: 600,mb: 1.5,backgroundColor:'rgb(242, 243, 243)',marginTop:'20px' }}>
                                        <CardContent>
                                            <Typography sx={{ mb: 1.5 }}>
                                                 username : {requirement?.confirmedTeacherId.username}
                                            </Typography>
                                            <Typography sx={{ mb: 1.5 }}>
                                                 email : {requirement?.confirmedTeacherId.email}
                                            </Typography>
                                            <Typography sx={{ mb: 1.5 }}>
                                                 phone : {requirement?.confirmedTeacherId.phone}
                                            </Typography>
                                            
                                        </CardContent>
                                    </Card>
                        </div> 
                        : 
                        <div>
                        <h3>Proposals from tutors</h3>
                                {
                                requirement?.proposals.length==0 ?  <p>No proposals yet!</p>: requirement?.proposals.map((ele,i)=>{
                                        return <Card variant="outlined" sx={{ maxWidth: 600,mb: 1.5,backgroundColor:'rgb(242, 243, 243)',marginTop:'20px' }} key={i}>
                                                    <CardContent>
                                                        <Typography sx={{ mb: 1.5 }}>
                                                            {ele.username}
                                                        </Typography>
                                                        <Button variant="contained" color="customYellow" sx={{marginRight:"20px"}} onClick={()=>{navigate(`/tutor/${ele._id}`)}}>View Profile</Button>
                                                        <Button variant="contained" color="customGreen" onClick={()=>{handleAcceptProposal(ele._id)}}>Accept Proposal</Button>
                                                    </CardContent>
                                                </Card>
                                    })
                                }<br /><br />
                       </div>

                    }
                    </>
                 )
            }
           
            <h3>Contact Info</h3>
            <p>username : {requirement?.creator.username}</p>
            <p>Email id: {requirement?.creator.email}</p>
            <p>phone : {requirement?.creator.phone}</p>

            {
                userState.userDetails.role=='teacher' && 
                <div style={{display:"flex",justifyContent:'center',alignItems:'center',marginBottom:30}}>
                    {
                        alreadyProposed() ? <strong>You have accepted the requirement. Please wait patiently for the response. <span style={{color:'rgb(226, 225, 130)'}}>ruko zara, sabar karo!</span> </strong> 
                        :
                        <Button variant="contained" size="large" onClick={handleAcceptRequirement}>Accept Requirement</Button>
                    }
                    
                </div>
            }
        </div></ThemeProvider> : 
        <div>loading...</div>
    )
}