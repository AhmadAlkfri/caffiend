type LayoutPropsType = {
    children: React.ReactNode
}

export default function Layout(props: LayoutPropsType){
    const {children} = props

    const header = (
        <header>
            <div>
                <h1 className="text-gradient">CAFFIEND</h1>
                <p>For Caffeine Demons 😈</p>
            </div>
            <button>
                <i className="fa-solid fa-mug-hot"></i>
                <p>Sign Up!</p>
            </button>
        </header>
    )
    const footer = (
        <footer>
            <p><span className="text-gradient">Caffiend</span> was made by <a href="https://github.com/AhmadAlkfri" target="_blank">Ahmad Alkfri</a><br/>
            using the <a href="https://www.fantacss.smoljames.com" target="_blank">FantaCSS</a> design library</p>

        </footer>
    )
    return (
        <>
            {header}
            <main>
                {children}
            </main>
            {footer}
            
        </>
    )
}