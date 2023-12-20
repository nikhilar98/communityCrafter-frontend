import { useContext } from "react"
import { userContext } from "../../App"
import Footer from "./Footer"
import Example from "./Carousel"
import CarouselContainer from "./Carousel"



export default function Home(){ 

    const {userState,userDispatch} = useContext(userContext)

    return (
        <>
        <div className="setBackgroundImageHome">
            <h1 style={{marginTop:30,color:'white'}}>Welcome to <span style={{color:'rgb(226, 225, 130)'}}>Community Crafter</span></h1>
            <p style={{maxWidth:'1000px'}}> We prioritize the sense of community. Communities can effortlessly post class requirements, and tutors can seamlessly connect with these opportunities, fostering collaboration and enriching educational experiences.</p>
            <p style={{maxWidth:'1000px',marginBottom:40}}>
            We believe in the transformative power of education and community, and our platform is designed to bring together passionate individuals who share a love for teaching and learning.
            </p>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <CarouselContainer/>
            </div>
        </div>
        <Footer/>
        </>
    )
}