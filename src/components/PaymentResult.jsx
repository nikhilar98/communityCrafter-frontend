import { useContext, useEffect, useState } from "react"
import axios from "../axios/axios"
import { userContext } from "../App"
import { useLocation, useNavigate } from "react-router-dom"
import queryString from 'query-string'
import { ThemeProvider } from "@emotion/react"
import theme from "../appTheme"
import { Box, Button, CircularProgress, Modal, Typography } from "@mui/material"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius:'20px',
    boxShadow: 24,
    p: 4,
  };

export default function PaymentResult() { 

    const {userDispatch} = useContext(userContext)

    const location = useLocation()
    const navigate  = useNavigate()
    const { search } = location;  //location.search is the query string  eg: ?success=true or ?canceled=true
    console.log('parse result of query',queryString.parse(search)) //parses the query string into an object
    const { success, canceled } = queryString.parse(search);
    


    const navigateUserToRequirement=()=>{
        navigate(`/requirement/${JSON.parse(localStorage.getItem('requirement'))._id}`)
        localStorage.removeItem('requirement')
        localStorage.removeItem('tutorId')
        localStorage.removeItem('transactionId')
    }

    useEffect(()=>{
        if(success){
            (async function(){ 
                try{
                    const response = await axios.put(`/comcraft/classRequirement/${JSON.parse(localStorage.getItem('requirement'))._id}`,
                    {userId:localStorage.getItem('tutorId')},
                    {
                        headers:{
                            Authorization: localStorage.getItem('token')
                        }
                    })
                    console.log('response after updating',response.data)
                    userDispatch({type:'UPDATE_USER_REQUIREMENT',payload:response.data.requirement})
                    const updatePaymentStatus = await axios.put(`/comcraft/checkout/${localStorage.getItem('transactionId')}`,null,{
                        headers:{
                            Authorization: localStorage.getItem('token')
                        }
                    })
                    console.log('UPDATEDPAYMENT',updatePaymentStatus)
                    setTimeout(()=>{
                        navigateUserToRequirement()
                    },5000)
                }
                catch(err){
                    console.log(err)
                }
                
            })()
                        
        }
        else
        {   (async function(){
                    try{
                        const deletePayment  = await axios.delete(`/comcraft/checkout/${localStorage.getItem('transactionId')}`,{
                            headers:{
                                Authorization: localStorage.getItem('token')
                            }
                        })
                        console.log('DELETEDPAYMENT',deletePayment)
                        setTimeout(()=>{
                            navigateUserToRequirement()
                        },5000)
                    }
                    catch(err){
                            console.log(err)
                    }
             })()
           
        }
           
    },[])

    return ( 

        success ? 
        <ThemeProvider theme={theme}>
            <Modal open={true} 
                aria-labelledby="payment-success-message"
                aria-describedby="payment-success-message">
                    <Box sx={style}>
                        <Typography variant="h6" component="h2">Payment Successful!</Typography>
                        <CircularProgress color='success'/><br/><br/>
                        <Button variant="contained" color="customGreen" onClick={navigateUserToRequirement}>Go to requirement</Button>                                          
                    </Box>
            </Modal> 
        </ThemeProvider>
         : 
         <ThemeProvider theme={theme}>
            <Modal open={true} 
                aria-labelledby="payment-failure-message"
                aria-describedby="payment-failure-message">
                    <Box sx={style}>
                        <Typography variant="h6" component="h2">uh ohh... Payment failed!</Typography>
                        <CircularProgress color='secondary'/><br/><br/>
                        <Button variant="contained" color="customRed" onClick={navigateUserToRequirement}>Retry</Button>                                          
                    </Box>
            </Modal> 
        </ThemeProvider>
    )
}