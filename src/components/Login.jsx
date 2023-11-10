import LoginForm from "./LoginForm"

export default function Login(){ 

    function handleSubmit(e){
        e.preventDefault()
    }


    return (
        <div className="setBackgroundImage">
           <LoginForm/>
        </div>
    )
}