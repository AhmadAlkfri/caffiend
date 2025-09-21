import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { FirebaseError } from "firebase/app"

type authProps = {
    handleCloseModal: ()=>void
}

export default function Authentication(props: authProps){
    const { handleCloseModal } = props
    const { signUp, logIn } = useAuth()
    const [isRegistering, setIsRegistering] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const [error, setError] = useState<string|null>(null)

    async function handleAuthentication(){
        let exit = true
        if(!email || !password || isAuthenticating){ return }
        try{
            exit = true
            setIsAuthenticating(true)
            setError(null)
            if(isRegistering){ await signUp(email, password)}
            else{
                await logIn(email, password)
            }
        }catch(e: unknown){
            exit = false
            if(e instanceof FirebaseError){
                setError(e.message)
            } 
        }finally{
            setIsAuthenticating(false)
            if(exit){handleCloseModal()}
        }
    }

    return (
        <>
            <h2 className="sign-up-text">{!isRegistering ? "Login" : "Sign Up"}</h2>
            <p>{!isRegistering ? "Sign in to your account" : "Create an account"}</p>
            {error && (
                <p>❌{error}</p>
            )}
            <input value={email} onChange={(e)=>{setEmail(e.currentTarget.value)}} placeholder="Email"/>
            <input value={password} onChange={(e)=>{setPassword(e.currentTarget.value)}} placeholder="•••••••" type="password" />
            <button disabled={isAuthenticating} onClick={handleAuthentication}><p>{isAuthenticating?"Authenticating..." : "Submit"}</p></button>
            <hr />
            <div className="register-content">
                <p>{!isRegistering ? "Don't have an account?" : "Already have an account?"}</p>
                <button onClick={()=>setIsRegistering(!isRegistering)}><p>{!isRegistering ? "Sign Up!" : "Login"}</p></button>
            </div>
        </>
    )
}