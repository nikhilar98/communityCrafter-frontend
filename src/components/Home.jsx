import { useContext } from "react"
import { appContext } from "../App"


export default function Home(){ 

    const {userState,userDispatch} = useContext(appContext)

    return (
        
        <div className="setBackgroundImage">
            <h1>Home</h1>
        </div>
    )
}