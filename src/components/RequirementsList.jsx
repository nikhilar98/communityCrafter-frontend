import { useContext, useEffect, useState } from "react"
import { userContext } from "../App"
import axios from "../axios/axios"
import { ToastContainer, toast } from 'react-toastify';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function RequirementsList (props){ 

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
    },[])

    return ( 
        <div>
            <ToastContainer/>
            {
                userState.requirements.map(ele=>{
                    return <Card variant="outlined" sx={{ maxWidth: 800,m: 1.5,backgroundColor:'rgb(242, 243, 243)' }} key={ele._id}>
                                <CardContent>
                                    <Typography variant="h4" color="text.secondary" gutterBottom>
                                        {ele.title}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }}>
                                       Category : {categories.find(cat=>cat._id==ele.categoryId)?.name} 
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }}>
                                        duration : {ele.duration} months
                                    </Typography>
                                    <Link to={`/requirement/${ele._id}`}><Button>View more Details</Button></Link>
                                </CardContent>
                            </Card>
                })
            }
        </div>
    )
}