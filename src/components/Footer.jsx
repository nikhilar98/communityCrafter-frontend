import { Link } from "react-router-dom";
import {Container,Typography,Grid,Box, ThemeProvider} from "@mui/material";
import { LinkedIn, Instagram, Twitter, YouTube } from "@mui/icons-material";
import theme from "../appTheme";
// import instalogo from '../images/icons8-instagram-30.png'
// import linkedinlogo from '../images/icons8-linkedin-30.png'
// import twitterlogo from '../images/icons8-twitter-30.png'
// import youtubelogo from '../images/icons8-youtube-30.png'

export default function Footer() {
    return (
        <ThemeProvider theme={theme}>
        <Box
        component="footer"
        sx={{
            backgroundColor: 'customYellow',
            color:'customBlue'
        }}
        >
        <Container maxWidth="lg">
            <Grid container spacing={5}>
            <Grid item xs={12} sm={4}>
                <Typography variant="h6" color="text.primary" gutterBottom>
                About Us
                </Typography>
                <Typography variant="body2" color="text.secondary">
                At CommunityCrafter, our mission is to empower communities to exchange knowledge and skills, creating vibrant spaces for learning and growth. Whether you're a community looking to host classes for your community peeps or a teacher seeking new opportunities, we're here to facilitate connections that inspire meaningful learning experiences.
                </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Typography variant="h6" color="text.primary" gutterBottom>
                Contact Us
                </Typography>
                <Typography variant="body2" color="text.secondary">
                Church St, Haridevpur, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001
                </Typography>
                <Typography variant="body2" color="text.secondary">
                Email: mail@comcraft.com
                </Typography>
                <Typography variant="body2" color="text.secondary">
                Phone: +91 945684235
                </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Typography variant="h6" color="text.primary" gutterBottom>
                Follow Us
                </Typography>
                <Link to="https://www.facebook.com/" target="_blank" color="inherit">
                <LinkedIn />
                </Link>
                <Link
                to="https://www.instagram.com/"
                color="inherit"
                target="_blank"
                sx={{ pl: 1, pr: 1 }}
                >
                <Instagram />
                </Link>
                <Link to="https://www.twitter.com/" target="_blank"color="inherit">
                <Twitter />
                </Link>
                <Link to="https://www.youtube.com/" target="_blank" color="inherit">
                <YouTube />
                </Link>
            </Grid>
            </Grid>
            <Box mt={5}>
            <Typography variant="body2" color="text.secondary" align="center">
                {"Copyright © "}
                <Link color="inherit" href="https://your-website.com/">
                CommunityCrafter
                </Link>{" "}
                {new Date().getFullYear()}
                {"."}
            </Typography>
            </Box>
        </Container>
        </Box>
        </ThemeProvider>
    )
    
}