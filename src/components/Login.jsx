import LoginForm from "./LoginForm"
import { useLocation } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export default function Login(){ 

    const location = useLocation()

    const notify = () => toast("Registered Successfully. Check your mail to Login!");

    function handleSubmit(e){
        e.preventDefault()
    }

    console.log(location.state?.msg)
    if(location.state){
        notify()
    }



    return (
        <div className="setBackgroundImage">
            <ToastContainer />
           <LoginForm/>
        </div>
    )
}