import { useContext } from "react"
import { userContext } from "../App"


export default function Home(){ 

    const {userState,userDispatch} = useContext(userContext)

    return (
        
        <div className="setBackgroundImage">
            <h1>Home</h1>
        </div>
    )
}