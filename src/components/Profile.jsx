import { useContext } from "react"
import { appContext } from "../App"
import {isEmpty} from 'lodash'
import ProfileDisplay from "./ProfileDisplay"
import ProfileForm from "./ProfileForm"

export default function Profile() { 

    const {userState} = useContext(appContext) 

    return ( 
        <div>
            {
                isEmpty(userState.profileData) ? <ProfileForm/>:<ProfileDisplay/>
            }
        </div>
    )
}

