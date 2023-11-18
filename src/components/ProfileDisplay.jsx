import { useContext } from "react"
import { userContext } from "../App"
import { useSelector } from "react-redux"
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardMedia } from "@mui/material";



export default function ProfileDisplay() { 

    const {userState} = useContext(userContext) 
    const address = userState.profileData.address

    const categories = useSelector((state)=>{
        return state.categories
    })
    console.log(categories)

    return ( 
        <div style={{paddingLeft:"20px"}}>
            {userState.userDetails.role=='teacher' && <h2>Bio</h2>}
            <p>{userState.profileData.bio}</p>
            <h2>Address</h2>
            <p>{`${address.building}, ${address.locality}, ${address.city}, ${address.state}, ${address.country} - ${address.pincode}`}</p>
            {userState.userDetails.role=='teacher' && <h2>Teaching categories</h2>}
            {
                userState.profileData.teachingCategories.map(ele=>{
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
    )
}