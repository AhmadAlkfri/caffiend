import { useState } from "react"
import { coffeeOptions } from "../utils"
import type { User } from "firebase/auth"
import type { historyType } from "../utils/types"
import { useAuth } from "../context/AuthContext"
import { doc, setDoc } from "firebase/firestore"
import { db } from "../../firebase"
type formProps = {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    isAuthenticated: User | null
}

export default function CoffeeForm(props: formProps){
    const {setShowModal, isAuthenticated} = props
    const [showCoffeeTypes, setShowCoffeeTypes] = useState(false)
    const [coffeeSelection, setCoffeeSelection] = useState("")
    const [coffeeCost, setCoffeeCost] = useState(0)
    const [hours, setHours] = useState(0)
    const [mins, setMins] = useState(30)
    const { globalUser, globalData, setGlobalData } = useAuth()
    async function handleSubmitForm(){
        if(!isAuthenticated){
            setShowModal(true)
            return
        }
        
        if(!coffeeSelection) { return }
        
        try{
            const newItem = {"name": coffeeSelection, "cost": coffeeCost}
            const newGlobalData: historyType= {
                ...(globalData || {})
            }
            
            const nowTime = Date.now()
            const timeToSubtract = (hours * 60 * 60 * 1000) + (mins * 60 * 1000)
            const timestamp = nowTime - timeToSubtract
            newGlobalData[timestamp] = newItem

            setGlobalData(newGlobalData)
            
            const userRef = doc(db, "users", globalUser?.uid || "")
            await setDoc(userRef, {[timestamp]: newItem}, {merge: true})
            setCoffeeSelection("")
            setHours(0)
            setMins(30)
            setCoffeeCost(0)
            setShowCoffeeTypes(false)

        }catch(err){
            console.log(err)
        }
        


    }

    return(
        <>
            <div className="section-header">
                <i className="fa-solid fa-pencil"></i>
                <h2> Start Tracking Today</h2>
            </div>
            <h4>Select coffee type</h4>
            <div className="coffee-grid">
                {coffeeOptions.slice(0,5).map((option, optionIndex) => {
                    return (
                        <button className={"button-card " + (option.name === coffeeSelection ? "coffee-button-selected" : "")}
                        key={optionIndex}
                        onClick={()=>{
                            setCoffeeSelection(option.name)
                            setShowCoffeeTypes(false)
                        }}
                        >
                            <h4>{option.name}</h4>
                            <p>{option.caffeine} mg</p>
                        </button>
                    )
                })}
                <button className={"button-card " + (showCoffeeTypes ? "coffee-button-selected" : "")}
                onClick={()=>{
                    setShowCoffeeTypes(true)
                    setCoffeeSelection("")
                }}
                >
                    <h4>Custom</h4>
                    <p>?? mg</p>
                </button>
            </div>
            {showCoffeeTypes && (
                <select id="coffee-list" name="coffee-list"
                onChange={(e)=>{setCoffeeSelection(e.currentTarget.value)}}
                >
                <option value={undefined}>Select type...</option>
                {coffeeOptions.map((option, optionIndex) => {
                    return(
                        <option value={option.name} key={optionIndex}>
                            {option.name} ({option.caffeine}mg)
                        </option>
                    )
                })}
            </select>)}
            <h4>Add the cost ($)</h4>
            <input className="w-full" type="number" min="0" placeholder="0.00"
            onWheel={(e) => e.currentTarget.blur()}
            value={coffeeCost > 0 ? coffeeCost : ""}
            onChange={(e) => e.currentTarget.valueAsNumber ? setCoffeeCost(e.currentTarget.valueAsNumber) : setCoffeeCost(0)}
            />
            <h4>Time since consumption: <span className="text-gradient">{hours}h {mins}m</span></h4>
            <div className="time-entry">
                <div>
                    <h6>Hours</h6>
                    <input id="hours-input" type="range" min={0} max={23} step={1} defaultValue={0}
                    onChange={(e)=>{setHours(e.currentTarget.valueAsNumber)}}/>
                </div>
                <div>
                    <h6>Minutes</h6>
                    <input id="mins-input" type="range" min={0} max={59} step={1} defaultValue={30}
                    onChange={(e)=>{setMins(e.currentTarget.valueAsNumber)}}/>
                </div>
            </div>
            <button
            onClick={handleSubmitForm}>
                <p>Add Entry</p>
            </button>
        </>
    )
}