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
import { Box, CircularProgress, Slider, ToggleButton, ToggleButtonGroup } from "@mui/material";

export default function RequirementsList (props){ 

    const navigate= useNavigate()
    const {userState,userDispatch} = useContext(userContext) 
    const [view,setView] = useState('list')
    const [searchText,setSearchText] = useState('')
    const [pageNo,setPageNo] = useState(1)
    const [isLoading,setisLoading] = useState(true)
    const role = userState.userDetails.role
    const categories = useSelector((state)=>{
        return state.categories
    })
 
    const notify= (msg) => { toast.error(msg)}
    
    function handleChange(e){
        setView(e.target.value)
    }
    const handlePageChange = (event, value) => {
        setPageNo(value);
      };

    const filteredRequirements = userState.requirements.filter(ele=>ele.title.includes(searchText))
    
    useEffect(()=>{
           ( async function(){
                try{
                    if(role=='teacher'){
                        const requirements = await axios.get(`/comcraft/classRequirements/pending?sortOrder=${userState.requirementsSortingOrder}&searchDistance=${userState.searchDistance}`,{
                        headers:{
                            Authorization: localStorage.getItem('token')
                        }
                        })  //for getting all pending community requirements based on teachers location
                        setisLoading(false) 
                        userDispatch({type:"SET_USER_REQUIREMENTS",payload:requirements.data})
                        setPageNo(1)
                        
                    }
                    else if(role=='communityHead'){
                        const requirements = await axios.get(`/comcraft/classRequirements?sortOrder=${userState.requirementsSortingOrder}`,{
                        headers:{
                            Authorization: localStorage.getItem('token')
                        }
                        }) //for getting all requirements created by a cm head
                        setisLoading(false)
                        userDispatch({type:"SET_USER_REQUIREMENTS",payload:requirements.data})
                        setPageNo(1)
                        
                    }
                }
                catch(err){
                    notify(err.response.data.errors[0].msg)
                }
                
            })()
    },[role,userState.requirementsSortingOrder,userState.searchDistance])

    return ( 
        <div>
            <ToastContainer/>
            <div style={{margin: 10}}>
                { role =='communityHead' ? 
                    <h1>My requirements</h1> 
                    : 
                    <div style={{display:'flex',alignItems:'center'}}>
                        <h1>Requirements available</h1>
                        <ToggleButtonGroup
                            color="primary"
                            value={view}
                            exclusive
                            onChange={handleChange}
                            aria-label="requirements-view"
                            sx={{height:"30px",ml:'20px'}}
                            >
                            <ToggleButton value='list' >List view</ToggleButton>
                            <ToggleButton value='map' >Map view</ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                }
            </div>

            {( userState.profileData && userState.requirements.length==0) && <p style={{margin: 10}}>{ role =='communityHead' ? 'No requirements created': 'No new requirements available in your set search area.'}</p>}

            {   
                view=='list' && 
            
                <div style={{margin: 10}}>
                    <label htmlFor="sortOrder">Sort by creation date : </label>
                    <select id="sortOrder" value={userState.requirementsSortingOrder} onChange={(e)=>{userDispatch({type:'SET_LIST_SORT_ORDER',payload:e.target.value})}}>
                        <option value="ascending">Oldest first</option>
                        <option value="descending">Latest first</option>
                    </select>
                    <label htmlFor="searchText" style={{marginLeft:'20px'}}>Search for keyword : </label>
                    <input type="text" id="searchText" value={searchText} onChange={(e)=>{setSearchText(e.target.value)}}/>
                </div>
            }

            {
               role=='teacher' && <div style={{marginLeft:"10px"}}>
                <p style={{color:'rgb(36, 41, 47)',fontSize:'15px',marginBottom:'0'}}>Showing requirements available within {userState.searchDistance/1000} kms from your home.</p>
                <Box sx={{ width: 300,ml:'5px' }}>
                    <Slider
                        aria-label="distance"
                        value={userState.searchDistance}
                        onChange={(e)=>{userDispatch({type:'SET_SEARCH_DISTANCE',payload:e.target.value})}}
                        step={5000}
                        min={1000}
                        max={51000}
                    />
                </Box>
               </div>
            }

            {
                (isLoading  && userState.profileData) && <CircularProgress  size={50} sx={{marginLeft:"20px"}}/>
            }
            
            {

            view=='list' ? 

            <div>
                {   
                    
                    filteredRequirements.slice(pageNo*3-3,pageNo*3).map(ele=>{
                        return <Card variant="outlined" sx={{ maxWidth: 800,m: 1.5,backgroundColor:'rgb(242, 243, 243)'}} key={ele._id}>
                                    <CardContent>
                                        <div style={{display:"flex",alignItems:'center',justifyContent:'space-between'}}>
                                        <Typography variant="h4" color="text.secondary" gutterBottom>
                                            {ele.title}
                                        </Typography>
                                        {
                                            role=='communityHead' ?  <Typography sx={{ mb: 1.5 ,color: ele.status=='pending' ? 'red' : 'green',fontWeight:'600'}}>
                                            status : {ele.status} </Typography>
                                            
                                            :
                                            
                                            ele.proposals.find(ele=>ele==userState.userDetails._id) && <Typography sx={{ mb: 1.5,color:'orange' }}>
                                            waiting for response</Typography>
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
                <Pagination sx={{display:'flex',justifyContent:'center'}} count={Math.ceil(filteredRequirements.length/3)} value={pageNo} onChange={handlePageChange}/>
            </div>

            : 
            <>
                {
                    
                ( role=='teacher' && userState.profileData?.address && categories) && 
                <Map teacherLocation={userState.profileData.address?.location.coordinates.reverse()} requirements={userState.requirements} categories={categories}/>
                }
             </>
            }

        
        </div>
    )
}