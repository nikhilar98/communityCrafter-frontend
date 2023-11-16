import { useContext } from "react"
import { userContext } from "../App"
import {isEmpty} from 'lodash'
import ProfileDisplay from "./ProfileDisplay"
import ProfileForm from "./ProfileForm"

export default function Profile() { 

    const {userState} = useContext(userContext) 

    return ( 
        <div>
            {
                isEmpty(userState.profileData) ? <ProfileForm/>:<ProfileDisplay/>
            }
        </div>
    )
}

