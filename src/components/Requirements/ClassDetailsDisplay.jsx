import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

    
export function ClassDetailsDisplay() { 


    const {classId} = useParams()
    const classItem = useSelector((state)=>{
        return state.teacherClasses.find(ele=>ele._id==classId)
    })
    const category = useSelector((state)=>{
        return state.categories.find(ele=>ele._id==classItem?.categoryId)
    })
    

    return (    
                    category ?
                    <div style={{marginLeft:20}}>
                        <h2>Category : {category?.name}</h2>
                        <p><strong>Community address :</strong> {classItem?.address.building}, {classItem?.address.locality}, {classItem?.address.city}, {classItem?.address.state}, {classItem?.address.country}, {classItem?.address.pincode}</p>
                        <p><strong>batch size range :</strong> {classItem?.batchSizeRange}</p>
                        <p><strong>Pay offered :</strong> &#8377;{classItem?.payOffered}</p>
                        <p><strong>weekdays : </strong> {classItem?.weekdays.join(", ")}</p>
                        <p><strong>Desired Time slot :</strong> {classItem?.desiredTimeSlot}</p>
                        <p><strong>Commencement Date :</strong> {new Date(classItem?.commencementDate).toDateString()}</p>
                        <p><strong>Duration :</strong> {classItem?.duration} months</p>
                        <p><strong>Description :</strong> {classItem?.description}</p><br /><br />
                        
                        <h3>Contact Info</h3>
                        <p>username : {classItem?.creator.username}</p>
                        <p>Email id: {classItem?.creator.email}</p>
                        <p>phone : {classItem?.creator.phone}</p>
        
                    </div> :
                    <p>Loading...</p>
            )

            

      
}