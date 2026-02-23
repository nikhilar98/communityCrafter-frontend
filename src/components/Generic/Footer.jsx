import { Link } from "react-router-dom";
import { Container, Typography, Grid, Box, ThemeProvider, IconButton } from "@mui/material";
import { LinkedIn, Instagram, Twitter, YouTube } from "@mui/icons-material";
import theme from "../../appTheme";

export default function Footer() {
    return (
        <ThemeProvider theme={theme}>
            <Box
                component="footer"
                sx={{
                    backgroundColor: "rgb(226, 225, 130)",
                    color: "rgb(51, 102, 122)",
                    py: { xs: 4, md: 6 },
                    px: { xs: 2, md: 4 },
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={{ xs: 3, md: 5 }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }} gutterBottom>
                                About Us
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                                At CommunityCrafter, our mission is to empower communities to exchange knowledge and skills, creating vibrant spaces for learning and growth. Whether you're a community looking to host classes or a teacher seeking new opportunities, we're here to facilitate connections.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }} gutterBottom>
                                Contact Us
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                                Church St, Haridevpur, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                                Email: mail@comcraft.com
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                                Phone: +91 945684235
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }} gutterBottom>
                                Follow Us
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                <IconButton component={Link} to="https://www.linkedin.com/" target="_blank" sx={{ color: "rgb(51, 102, 122)", "&:hover": { backgroundColor: "rgba(51,102,122,0.1)" } }}>
                                    <LinkedIn />
                                </IconButton>
                                <IconButton component={Link} to="https://www.instagram.com/" target="_blank" sx={{ color: "rgb(51, 102, 122)", "&:hover": { backgroundColor: "rgba(51,102,122,0.1)" } }}>
                                    <Instagram />
                                </IconButton>
                                <IconButton component={Link} to="https://www.twitter.com/" target="_blank" sx={{ color: "rgb(51, 102, 122)", "&:hover": { backgroundColor: "rgba(51,102,122,0.1)" } }}>
                                    <Twitter />
                                </IconButton>
                                <IconButton component={Link} to="https://www.youtube.com/" target="_blank" sx={{ color: "rgb(51, 102, 122)", "&:hover": { backgroundColor: "rgba(51,102,122,0.1)" } }}>
                                    <YouTube />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box mt={{ xs: 3, md: 5 }}>
                        <Typography variant="body2" color="text.secondary" align="center">
                            {"Copyright © "}
                            <Link color="inherit" to="/" style={{ color: "inherit" }}>
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