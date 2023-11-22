import { useContext, useEffect, useState } from "react"
import { userContext } from "../App"
import axios from "../axios/axios"
import { ToastContainer, toast } from 'react-toastify';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {isEmpty} from 'lodash'

export default function RequirementsList (props){ 

    const navigate= useNavigate()
    const {userState,userDispatch} = useContext(userContext) 
    const role = userState.userDetails.role
    const categories = useSelector((state)=>{
        return state.categories
    })

 
    const notify= (msg) => { toast.error(msg)}
    

    useEffect(()=>{
           ( async function(){
                try{
                    if(role=='teacher'){
                        const requirements = await axios.get('/comcraft/classRequirements/pending',{
                        headers:{
                            Authorization: localStorage.getItem('token')
                        }
                        })  //for getting all pending community requirements based on teachers location
                        console.log('teacher requirements',requirements.data)  
                        userDispatch({type:"SET_USER_REQUIREMENTS",payload:requirements.data})
                        
                    }
                    else if(role=='communityHead'){
                        const requirements = await axios.get('/comcraft/classRequirements',{
                        headers:{
                            Authorization: localStorage.getItem('token')
                        }
                        }) //for getting all requirements created by a cm head
                        console.log('cmhead requirements',requirements.data) 
                        userDispatch({type:"SET_USER_REQUIREMENTS",payload:requirements.data})
                        
                    }
                }
                catch(err){
                    console.log(err)
                    notify(err.response.data.errors[0].msg)
                }
                
            })()
    },[role])

    return ( 
        <div>
            <ToastContainer/>
            <h1 style={{margin: 10}}>{ role =='communityHead' ? 'My requirements': 'Requirements available'}</h1>
            {( userState.profileData && userState.requirements.length==0) && <p style={{margin: 10}}>{ role =='communityHead' ? 'No requirements created': 'No new requirements available in your area.'}</p>}
            {
                userState.requirements.map(ele=>{
                    return <Card variant="outlined" sx={{ maxWidth: 800,m: 1.5,backgroundColor:'rgb(242, 243, 243)' }} key={ele._id}>
                                <CardContent>
                                    <div style={{display:"flex",alignItems:'center',justifyContent:'space-between'}}>
                                    <Typography variant="h4" color="text.secondary" gutterBottom>
                                        {ele.title}
                                    </Typography>
                                    {
                                        role=='communityHead' &&  <Typography sx={{ mb: 1.5 ,color: ele.status=='pending' ? 'red' : 'green',fontWeight:'600'}}>
                                        status : {ele.status} 
                                    </Typography>
                                    }
                                    </div>
                                    <Typography sx={{ mb: 1.5 }}>
                                       Category : {categories.find(cat=>cat._id==ele.categoryId)?.name} 
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }}>
                                        duration : {ele.duration} months
                                    </Typography>
                                    <Button onClick={()=>{navigate(`/requirement/${ele._id}`)}}>View more Details</Button>
                                </CardContent>
                            </Card>
                })
            }
        </div>
    )
}