import {Link} from 'react-router-dom'
import RegistrationForm from './RegistrationForm'
export default function Register(){ 
    
    
    function handleSubmit(e){
        e.preventDefault()
    }
    return (
        <div className="setBackgroundImage">
            <RegistrationForm/>
        </div>
    )
}