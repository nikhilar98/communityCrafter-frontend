import { useContext } from "react"
import { userContext } from "../App"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"

export default function RequirementDisplay (props){ 

        const {id} = useParams()
        const {userState,userDispatch} = useContext(userContext)

        const requirement = userState.requirements.find(ele=>ele._id==id)

        const category = useSelector((state)=>{
            return state.categories.find(ele=>ele._id==requirement.categoryId)
        })
        

    return ( 
        <div>
            <h1>{requirement.title}</h1>
            <h2>{category.name}</h2>
            <p><strong>batch size range :</strong> {requirement.batchSizeRange}</p>
            <p><strong>Pay offered :</strong> &#8377;{requirement.payOffered}</p>
            <p><strong>Desired Time slot :</strong> {requirement.desiredTimeSlot}</p>
            <p><strong>Commencement Date :</strong> {new Date(requirement.commencementDate).toDateString()}</p>
            <p><strong>Duration :</strong> {requirement.duration}</p>
            <p><strong>Description :</strong> {requirement.description}</p>
        </div>
    )
}