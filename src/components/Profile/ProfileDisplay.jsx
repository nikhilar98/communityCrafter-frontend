import { useContext } from "react"
import { userContext } from "../../App"
import { useSelector } from "react-redux"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardMedia, Container, Grid, Box } from "@mui/material";



export default function ProfileDisplay() { 

    const {userState} = useContext(userContext) 
    const address = userState.profileData.address

    const categories = useSelector((state)=>{
        return state.categories
    })
    
    return ( 
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
            <Card variant="outlined" sx={{ mb: 2, backgroundColor: 'rgb(242, 243, 243)' }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography variant="h4" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '1.4rem', md: '2rem' } }}>
                      Account Details
                    </Typography>
                    <Typography sx={{ mb: 1.5 }}>
                       username : {userState.userDetails.username}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }}>
                        email : {userState.userDetails.email} 
                    </Typography>
                    <Typography sx={{ mb: 1.5 }}>
                        phone : {userState.userDetails.phone}
                    </Typography>
                </CardContent>
            </Card>
            {userState.userDetails.role=='teacher' && <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>Bio</Typography>}
            <Typography variant="body1" sx={{ lineHeight: 1.7 }}>{userState.profileData.bio}</Typography>
            <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>Address</Typography>
            <Typography variant="body1">{`${address.building}, ${address.locality}, ${address.city}, ${address.state}, ${address.country} - ${address.pincode}`}</Typography>
            {userState.userDetails.role=='teacher' && <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>Teaching categories</Typography>}
            {
                userState.profileData.teachingCategories.map(ele=>{
                    return  <Card variant="outlined" sx={{ mb: 2, backgroundColor: 'rgb(242, 243, 243)' }} key={ele._id}>
                                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                    <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                                        {categories.find(category=>category._id==ele.categoryId)?.name}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }}>
                                        Experience: {ele.experience} years
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }}>
                                        Certificates 
                                    </Typography>
                                    <Grid container spacing={2}>
                                    {
                                        ele.certificates.map((ele,i)=>{
                                            return <Grid item xs={12} sm={6} md={4} key={ele._id}>
                                                <CardMedia
                                                    component="img"
                                                    sx={{ width: "100%", maxWidth: "300px", borderRadius: "8px" }}
                                                    src={ele.url}
                                                    alt={`certificate-${i+1}`}
                                                />
                                            </Grid>
                                        })
                                    }
                                    </Grid>
                                </CardContent>
                            </Card>
                   
                })
            }
        </Container>
    )
}