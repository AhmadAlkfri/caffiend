import { useAuth } from "../context/AuthContext"
import Authentication from "./Authentication"
import Modal from "./Modal"


type LayoutPropsType = {
    showModal: boolean
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    children: React.ReactNode
}

export default function Layout(props: LayoutPropsType){
    const {showModal, setShowModal, children} = props
    const {globalUser, logOut} = useAuth()

    const header = (
        <header>
            <div>
                <h1 className="text-gradient">CAFFIEND</h1>
                <p>For Caffeine Demons 😈</p>
            </div>
            {globalUser ? 
            (
                <button onClick={logOut}>
                    <i className="fa-solid fa-mug-hot"></i>
                    <p>Log Out</p>
                </button>
            )
            :
            (
                <button onClick={()=>setShowModal(true)}>
                    <i className="fa-solid fa-mug-hot"></i>
                    <p>Login/Sign up</p>
                </button>
            )}
        </header>
    )
    const footer = (
        <footer>
            <p><span className="text-gradient">Caffiend</span> was made by <a href="https://github.com/AhmadAlkfri" target="_blank">Ahmad Alkfri</a><br/>
            using the <a href="https://www.fantacss.smoljames.com" target="_blank">FantaCSS</a> design library
            <br/>Check out the project on <a href="https://github.com/AhmadAlkfri/caffiend">GitHub</a></p>

        </footer>
    )
    return (
        <>
            {showModal && (
                <Modal handleCloseModal={()=>{setShowModal(false)}}>
                    <Authentication handleCloseModal={()=>{setShowModal(false)}} />
                </Modal>
            )}
            {header}
            <main>
                {children}
            </main>
            {footer}
            
        </>
    )
}