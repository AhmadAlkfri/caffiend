import ReactDom from 'react-dom'
type modalProps = {
    children: React.ReactNode
    handleCloseModal: ()=>void
}

export default function Modal(props: modalProps){
    const {children, handleCloseModal} = props
    return ReactDom.createPortal(
        <div className='modal-container'>
            <button onClick={handleCloseModal} className='modal-underlay'/>
            <div className='modal-content'>
                {children}
            </div>
        </div>,
        document.getElementById('portal')!
    )
}