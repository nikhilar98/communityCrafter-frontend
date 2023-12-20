import { useEffect, useState } from "react"
import axios from "../../axios/axios"
import { Button, Card, CardContent, Pagination, ThemeProvider, Typography } from "@mui/material"
import theme from "../../appTheme"
import { useNavigate } from "react-router-dom"

export default function TutorsListing(){

    const [tutors,setTutors] = useState([])
    const [pageNo,setPageNo] = useState(1)
    const navigate = useNavigate()

    const handlePageChange = (event, value) => {
        setPageNo(value);
      };


    useEffect(()=>{
        (async function(){
            try{
                const tutors = await axios.get('/comcraft/tutors',{
                    headers:{
                       Authorization : localStorage.getItem('token')
                    }
                })
                setTutors(tutors.data)
            }
            catch(err){
                console.log(err)
            }
        })()
    },[])

    return ( 
        <ThemeProvider theme={theme}>
        <div>
            <ul>
            {
                tutors.slice(pageNo*3-3,pageNo*3).map((ele,i)=>{
                    return <Card variant="outlined" sx={{ maxWidth: 600,mb: 1.5,backgroundColor:'rgb(242, 243, 243)',marginTop:'20px' }} key={i}>
                                <CardContent>
                                    <Typography sx={{ mb: 1.5 }}>
                                        {ele.user.username}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }}>
                                        email : {ele.user.email}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }}>
                                        phone : {ele.user.phone}
                                    </Typography>
                                    <Button variant="contained" color="customYellow" sx={{marginRight:"20px"}} onClick={()=>{navigate(`/tutor/${ele.user._id}`)}}>View Profile</Button>
                                </CardContent>
                            </Card>
                })
            }
            <Pagination sx={{display:'flex',justifyContent:'center'}} count={Math.ceil(tutors.length/3)} value={pageNo} onChange={handlePageChange}/>
             </ul>
            
        </div>
        </ThemeProvider>
    )
}

