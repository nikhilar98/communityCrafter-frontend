import { useContext } from "react"
import { userContext } from "../App"
import Footer from "./Footer"


export default function Home(){ 

    const {userState,userDispatch} = useContext(userContext)

    return (
        <>
        <div className="setBackgroundImageHome">
            <h1 style={{margin:0,color:'white'}}>Welcome to Community Crafter! </h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore ratione nihil, soluta sint nostrum sit molestias facere labore sequi architecto totam, cum eos! Laudantium odit voluptatibus vel iusto, at eos reiciendis, error inventore, asperiores obcaecati labore architecto minus laborum repudiandae consequatur? Minima asperiores voluptates labore animi! Ex soluta sapiente illo laborum veniam, cupiditate ab architecto, mollitia esse beatae sunt fugiat! Eos asperiores corrupti nesciunt obcaecati eaque odio consequatur, accusamus incidunt adipisci maxime sapiente fuga. Amet cumque illo commodi tenetur, dolorum dignissimos cum sed nihil expedita voluptatum, repellendus, minima distinctio repellat aliquid quibusdam minus blanditiis ipsam quia perspiciatis vero! Cum, iste.</p>
        </div>
        <Footer/>
        </>
    )
}