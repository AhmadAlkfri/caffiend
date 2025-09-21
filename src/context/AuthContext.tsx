import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useState, useEffect, useContext, createContext } from 'react'
import { auth, db } from "../../firebase"
import { doc, getDoc } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import type { contextType } from '../utils/types'

type authProviderProps = {
    children: React.ReactNode
}

//Fall back "last resort" values, should never actually hit these since all values are defined below
const nullVals: contextType = {
    globalUser: null,
    globalData: null,
    isLoading: false,
    setGlobalData: (obj: object) => {console.log(obj)},
    signUp: (email: string, password: string) => {console.log(email + password + "signup")},
    logIn: (email: string, password: string) => {console.log(email + password + "login")},
    logOut: () => {},
    resetPassword: (email: string) => {console.log(email + "reset")}
}


const AuthContext = createContext<contextType>(nullVals)

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(){
    return useContext(AuthContext)
}


export function AuthProvider(props:authProviderProps){
    const { children } = props
    const [globalUser, setGlobalUser] = useState<User|null>(null)
    const [globalData, setGlobalData] = useState<object|null>(null)
    const [isLoading, setIsLoading] = useState(false)
    
    function signUp(email: string, password: string){
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function logIn(email: string, password: string){
        return signInWithEmailAndPassword(auth, email, password)
    }
    
    function resetPassword(email: string){
        sendPasswordResetEmail(auth, email)
    }

    function logOut(){
        setGlobalUser(null)
        setGlobalData(null)
        return signOut(auth)
    }

    const value = { globalUser, globalData, isLoading, setGlobalData, signUp, logIn, logOut, resetPassword }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setGlobalUser(user)
            if(!user) { return }
            try{
                setIsLoading(true)

                const docRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(docRef)

                let firebaseData = {}

                if(docSnap.exists()){
                    firebaseData = docSnap.data()
                }
                setGlobalData(firebaseData)
            }catch(err){
                console.log(err)
            }finally{
                setIsLoading(false)
            }
        })
        return unsubscribe
    }, [])

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

}