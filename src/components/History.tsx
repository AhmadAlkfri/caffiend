import { useState } from "react";
import { calculateCurrentCaffeineLevel, coffeeConsumptionHistory, getCaffeineAmount, getDateFromUTC, getDDMM } from "../utils";

export default function Hisotry(){
    const [summary, setSummary] = useState("Click a coffee to see information!")
    const [selectedCup, setSelectedCup] = useState<number|undefined>(undefined)
    return(
        <>
            <div className="section-header">
                <i className="fa-solid fa-timeline" />
                <h2>History</h2>
            </div>
            <p><i>{summary}</i></p>
            <div className="coffee-history">
                {Object.keys(coffeeConsumptionHistory).sort((a, b) => {
                    if (a < b) {
                        return 1;
                    }

                    if (a > b) {
                        return -1;
                    }

                    return 0;
                }).map((utcTime, coffeeIndex)=>{
                    const coffee = coffeeConsumptionHistory[utcTime]
                    const originalAmount = getCaffeineAmount(coffee.name)
                    const remainingAmount = calculateCurrentCaffeineLevel({[utcTime]:coffee})
                    const date = getDateFromUTC(+utcTime)
                    const {day, month} = getDDMM(+utcTime)
                    const summaryString = `Coffee Type: ${coffee.name} \nConsumed: ${date} \nCost: $${coffee.cost} | ${remainingAmount}mg / ${originalAmount}mg of caffeine remaining in system`
                    
                    return(
                        <div title={summary} key={coffeeIndex}
                        className={"history-card " + (coffeeIndex === selectedCup ? "history-card-selected" : "")}
                        onClick={()=>{
                            setSummary(summaryString)
                            setSelectedCup(coffeeIndex)
                        }}>
                            <i className="fa-solid fa-mug-hot"></i>
                            <h6>{day}/{month}</h6>
                        </div>
                    )
                })}            
            </div>
        </>
    )
}