import { useContext, useEffect, useState } from "react"
import { userContext } from "../App"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { Button } from "@mui/material"

export default function RequirementDisplay (props){ 

        const {id} = useParams()
        const {userState,userDispatch} = useContext(userContext)
       
        const requirement = userState.requirements.find(ele=>ele._id==id)
        const category = useSelector((state)=>{
                        return state.categories.find(ele=>ele._id==requirement?.categoryId)
                    })
        // useEffect(()=>{
        //     const requirement = userState.requirements.find(ele=>ele._id==id)
        //     const category = useSelector((state)=>{
        //                 return state.categories.find(ele=>ele._id==requirement.categoryId).name
        //             })
        // },[userState])
        
        // console.log(location.state)
        // useEffect(()=>{
        //      if(!location.state){
        //         ( async function(){
        //             try{    
        //                 if(userState.userDetails.role=='teacher'){
                           
        //                     const requirements = await axios.get('/comcraft/classRequirements/pending',{
        //                     headers:{
        //                         Authorization: localStorage.getItem('token')
        //                     }
        //                     })  //for getting all pending community requirements based on teachers location
        //                     console.log('teacher requirements',requirements.data)  
        //                     userDispatch({type:"SET_USER_REQUIREMENTS",payload:requirements.data})
                            
        //                 }
        //                 else if(userState.userDetails.role=='communityHead'){
        //                     const requirements = await axios.get('/comcraft/classRequirements',{
        //                     headers:{
        //                         Authorization: localStorage.getItem('token')
        //                     }
        //                     }) //for getting all requirements created by a cm head
        //                     console.log('cmhead requirements',requirements.data) 
        //                     userDispatch({type:"SET_USER_REQUIREMENTS",payload:requirements.data})
                            
        //                 }
        //             }
        //             catch(err){
        //                 console.log(err)
        //             }
                    
        //         })()
        //      }
        // },[userState.userDetails])                

    return ( 
      requirement ?  <div style={{marginLeft:20}}>
            <h1>{requirement?.title}</h1>
            <h2>Category : {category.name}</h2>
            <p><strong>Community address :</strong> {requirement?.address.building}, {requirement?.address.locality}, {requirement?.address.city}, {requirement?.address.state}, {requirement?.address.country}, {requirement?.address.pincode}</p>
            <p><strong>batch size range :</strong> {requirement?.batchSizeRange}</p>
            <p><strong>Pay offered :</strong> &#8377;{requirement?.payOffered}</p>
            <p><strong>weekdays : </strong> {requirement?.weekdays.join(", ")}</p>
            <p><strong>Desired Time slot :</strong> {requirement?.desiredTimeSlot}</p>
            <p><strong>Commencement Date :</strong> {new Date(requirement?.commencementDate).toDateString()}</p>
            <p><strong>Duration :</strong> {requirement?.duration} months</p>
            <p><strong>Description :</strong> {requirement?.description}</p><br /><br />
            <h3>Contact Info</h3>
            <p>username : {requirement?.creator.username}</p>
            <p>Email id: {requirement?.creator.email}</p>
            <p>phone : {requirement?.creator.phone}</p>

            <div style={{display:"flex",justifyContent:'center'}}><Button variant="contained" size="large">Accept Requirement</Button></div>
        </div> : 
        <div>loading...</div>
    )
}