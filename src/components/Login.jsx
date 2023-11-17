import { useEffect } from "react";
import LoginForm from "./LoginForm"
import { useLocation } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export default function Login(){ 

    const location = useLocation()

    const notify = (msg) => toast.success(msg);

    function handleSubmit(e){
        e.preventDefault()
    }

    useEffect(()=>{
        if(location.state){
            notify(location.state.msg)
        }
    },[])

    return (
        <div className="setBackgroundImage">
            <ToastContainer />
            <LoginForm/>
        </div>
    )
}