import { useContext } from "react"
import { userContext } from "../App"
import { useSelector } from "react-redux"

export default function ProfileDisplay() { 

    const {userState} = useContext(userContext) 
    const address = userState.profileData.address

    const categories = useSelector((state)=>{
        return state.categories
    })
    console.log(categories)

    return ( 
        <div>
            <h2>Bio</h2>
            <p>{userState.profileData.bio}</p>
            <h2>Address</h2>
            <p>{`${address.building}, ${address.locality}, ${address.city}, ${address.state}, ${address.country} - ${address.pincode}`}</p>
            <h2>Teaching categories</h2>
            <hr />
            {
                userState.profileData.teachingCategories.map(ele=>{
                    return <li className="teachingCategoriesList" key={ele._id}>
                        <h3>{categories.find(category=>category._id==ele.categoryId)?.name}</h3>
                        <p>Experience ( in years ) : {ele.experience} </p>
                        <p>Certificates</p>
                        <span>
                            {
                                ele.certificates.map((ele,i)=>{
                                    return <span key={i}><img src={ele.url} alt={`certificate-${i+1}`} style={{width:"500px",margin:"10px"}}/></span>
                                })
                            }
                        </span>
                        <hr />
                    </li>
                })
            }
        </div>
    )
}