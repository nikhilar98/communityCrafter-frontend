import { useContext } from "react"
import { userContext } from "../../App"
import Footer from "./Footer"
import CarouselContainer from "./Carousel"
import { Box, Container, Typography } from "@mui/material"



export default function Home(){ 

    const {userState,userDispatch} = useContext(userContext)

    return (
        <>
        <Box className="setBackgroundImageHome">
            <Container maxWidth="lg" sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        mt: { xs: 2, md: 4 },
                        color: "white",
                        fontWeight: 700,
                        fontSize: { xs: "1.6rem", sm: "2.2rem", md: "2.8rem", xl: "3.4rem" },
                    }}
                >
                    Welcome to <span style={{ color: "rgb(226, 225, 130)" }}>Community Crafter</span>
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        maxWidth: "800px",
                        mt: 2,
                        color: "rgba(255,255,255,0.9)",
                        lineHeight: 1.7,
                        fontSize: { xs: "0.9rem", md: "1rem", xl: "1.15rem" },
                        mx: { xs: "auto", md: 0 },
                    }}
                >
                    We prioritize the sense of community. Communities can effortlessly post class requirements, and tutors can seamlessly connect with these opportunities, fostering collaboration and enriching educational experiences.
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        maxWidth: "800px",
                        mt: 1,
                        mb: { xs: 3, md: 5 },
                        color: "rgba(255,255,255,0.9)",
                        lineHeight: 1.7,
                        fontSize: { xs: "0.9rem", md: "1rem", xl: "1.15rem" },
                        mx: { xs: "auto", md: 0 },
                    }}
                >
                    We believe in the transformative power of education and community, and our platform is designed to bring together passionate individuals who share a love for teaching and learning.
                </Typography>
            </Container>
            <Box sx={{ display: "flex", justifyContent: "center", width: "100%", px: { xs: 1, md: 3 } }}>
                <CarouselContainer />
            </Box>
        </Box>
        <Footer/>
        </>
    )
}