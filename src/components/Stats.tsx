import { calculateCoffeeStats, calculateCurrentCaffeineLevel, coffeeConsumptionHistory, getTopThreeCoffees, statusLevels } from "../utils"

type StatCardPropsType = {
    lg: boolean,
    title: string,
    children: React.ReactNode
}

function StatCard(props: StatCardPropsType){
    const {lg, title, children} = props
    return(
        <div className={"card stat-card " + (lg ? "col-span-2" : "")}>
            <h4>{title}</h4>
            {children}
        </div>
    )
}

export default function Stats(){
    const stats = calculateCoffeeStats(coffeeConsumptionHistory)
    const caffeineLevel = calculateCurrentCaffeineLevel(coffeeConsumptionHistory)
    const warningLevel = caffeineLevel < statusLevels['low'].maxLevel ? "low" :
    caffeineLevel < statusLevels['moderate'].maxLevel ? "moderate" : "high"
    return(
        <>
            <div className="section-header">
                <i className="fa-solid fa-chart-simple" />
                <h2>Stats</h2>
            </div>
            <div className="stats-grid">
                <StatCard lg={true} title="Active Caffeine Level">
                    <div className="status">
                        <p><span className="stat-text">{caffeineLevel.toFixed(2)}</span>mg</p>
                        <h5 style={{color: statusLevels[warningLevel].color, background: statusLevels[warningLevel].background}}>Low</h5>
                    </div>
                    <p>{statusLevels[warningLevel].description}</p>
                </StatCard>
                <StatCard lg={false} title="Daily Caffeine">
                    <p><span className="stat-text">{stats.daily_caffeine.toFixed(2)}</span>mg</p>
                </StatCard>
                <StatCard lg={false} title="Daily Coffees">
                    <p><span className="stat-text">{stats.average_coffees.toFixed(2)}</span>{stats.average_coffees==1 ? "coffee" : "coffees"}/day</p>
                </StatCard>
                <StatCard lg={false} title="Daily Cost">
                    <p>$ <span className="stat-text">{stats.daily_cost.toFixed(2)}</span></p>
                </StatCard>
                <StatCard lg={false} title="Total Cost">
                    <p>$ <span className="stat-text">{stats.total_cost.toFixed(2)}</span></p>
                </StatCard>
                <table className="stat-table">
                    <thead>
                        <tr>
                            <th>Coffee Name</th>
                            <th>Number of Purchases</th>
                            <th>Percentage of Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getTopThreeCoffees(coffeeConsumptionHistory).map((coffee, coffeeIndex)=>{
                            return (
                                <tr key={coffeeIndex}>
                                    <td>{coffee.coffeeName}</td>
                                    <td>{coffee.count}</td>
                                    <td>{coffee.percentage}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}