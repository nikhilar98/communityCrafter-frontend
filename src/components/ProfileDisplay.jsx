import { useContext } from "react"
import { appContext } from "../App"

export default function ProfileDisplay() { 

    const {userState} = useContext(appContext) 
    console.log('profile display:',userState.profileData.bio)

    return ( 
        <div>
            <h1>Profile Display</h1>
            <p>{userState.profileData.bio}</p>
        </div>
    )
}