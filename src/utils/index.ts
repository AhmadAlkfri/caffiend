import type * as types from "./types"

export const statusLevels = {
    none: {
        color: "#28c428ff",
        background: "#d1fae5",
        description: '...',
        maxLevel: 0
    },
    low: {
        color: "#047857",
        background: "#d1fae5",
        description: 'Caffeine levels are mild, resulting in a light boost in alertness with minimal side effects.',
        maxLevel: 100
    },
    moderate: {
        color: "#b45309",
        background: "#fef3c7",
        description: 'A moderate amount of caffeine leads to noticeable stimulation, increased focus, and potential restlessness.',
        maxLevel: 200
    },
    high: {
        color: "#e11d48",
        background: "#ffe4e6",
        description: 'Elevated caffeine levels can cause jitteriness, rapid heartbeat, and trouble concentrating, signaling an excessive intake.',
        maxLevel: 1200
    },
    LETHAL: {
        color: "#ff0000ff",
        background: "#000000ff",
        description: 'How are you still alive? Go to a hospital please.',
        maxLevel: 999999999
    },
}

export const coffeeOptions: types.coffeeOption[] = [
    { "name": "Espresso", "caffeine": 63 },
    { "name": "Double Espresso", "caffeine": 126 },
    { "name": "Americano", "caffeine": 96 },
    { "name": "Cappuccino", "caffeine": 80 },
    { "name": "Latte", "caffeine": 80 },
    { "name": "Mocha", "caffeine": 90 },
    { "name": "Macchiato", "caffeine": 85 },
    { "name": "French Vanilla", "caffeine": 80 },
    { "name": "Flat White", "caffeine": 130 },
    { "name": "Cortado", "caffeine": 85 },
    { "name": "Red Eye", "caffeine": 159 },
    { "name": "Black Coffee (8oz)", "caffeine": 95 },
    { "name": "Iced Coffee (8oz)", "caffeine": 90 },
    { "name": "Cold Brew (12oz)", "caffeine": 155 },
    { "name": "Nitro Cold Brew (12oz)", "caffeine": 215 },
    { "name": "Drip Coffee (12oz)", "caffeine": 120 },
    { "name": "Frappuccino", "caffeine": 95 },
    { "name": "Turkish Coffee", "caffeine": 160 },
    { "name": "Irish Coffee", "caffeine": 70 },
    { "name": "Vietnamese Coffee", "caffeine": 100 },
    { "name": "Affogato", "caffeine": 65 },
    { "name": "Instant Coffee (1 tsp)", "caffeine": 30 },
    { "name": "Decaf Coffee", "caffeine": 2 },
    { "name": "Chai Latte", "caffeine": 40 },
    { "name": "Matcha Latte", "caffeine": 70 },
    { "name": "Monster Energy (16oz)", "caffeine": 160 },
    { "name": "Red Bull (8.4oz)", "caffeine": 80 },
    { "name": "Rockstar Energy (16oz)", "caffeine": 160 },
    { "name": "Bang Energy (16oz)", "caffeine": 300 },
    { "name": "Celsius Energy Drink (12oz)", "caffeine": 200 },
    { "name": "5-hour Energy (2oz)", "caffeine": 200 },
    { "name": "NOS Energy Drink (16oz)", "caffeine": 160 },
    { "name": "Reign Energy Drink (16oz)", "caffeine": 300 },
    { "name": "Starbucks Doubleshot (6.5oz)", "caffeine": 135 },
    { "name": "Monster Java (15oz)", "caffeine": 188 },
    { "name": "AMP Energy Drink (16oz)", "caffeine": 142 },
    { "name": "Zipfizz (1 tube)", "caffeine": 100 },
    { "name": "Water", "caffeine": 0}
]

const halfLifeHours = 5


export function calculateCurrentCaffeineLevel(historyData: types.historyType): number {
    if(!historyData){return 0}
    const currentTime = Date.now()
    const halfLife = halfLifeHours * 60 * 60 * 1000 // 5 hours in milliseconds
    const maxAge = 48 * 60 * 60 * 1000 // 48 hours in milliseconds

    let totalCaffeine = 0

    for (const [timestamp, entry] of Object.entries(historyData)) {
        const timeElapsed = currentTime - parseInt(timestamp)

        // Ignore entries older than 48 hours
        if (timeElapsed <= maxAge) {
            const caffeineInitial = getCaffeineAmount(entry.name)
            // Calculate the remaining caffeine using the half-life formula
            const remainingCaffeine = caffeineInitial * Math.pow(0.5, timeElapsed / halfLife)
            totalCaffeine += remainingCaffeine
        }
    }

    return totalCaffeine
}

export function getCaffeineAmount(coffeeName: string): number {
    const coffee = coffeeOptions.find(c => c.name === coffeeName)
    return coffee ? coffee.caffeine : 0
}

export function getTopThreeCoffees(historyData: types.historyType): types.topThreeType[] {
    if(!historyData) {return []}
    const coffeeCount: types.coffeeCountType = {}

    // Count occurrences of each coffee type
    for (const entry of Object.values(historyData)) {
        const coffeeName = entry.name
        if (coffeeCount[coffeeName]) {
            coffeeCount[coffeeName]++
        } else {
            coffeeCount[coffeeName] = 1
        }
    }

    const sortedCoffees = Object.entries(coffeeCount).sort((a, b) => b[1] - a[1])

    const totalCoffees = Object.values(coffeeCount).reduce((sum, count) => sum + count, 0)

    const topThree: types.topThreeType[] = sortedCoffees.slice(0, 3).map(([coffeeName, count]) => {
        const percentage = ((count / totalCoffees) * 100).toFixed(2)
        return {
            coffeeName: coffeeName,
            count: count,
            percentage: percentage + '%'
        }
    })

    return topThree
}

export function timeSinceConsumption(utcMilliseconds: number): string {
    const now = Date.now()
    const diffInMilliseconds = now - utcMilliseconds

    const seconds = Math.floor(diffInMilliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)

    const remainingDays = days % 30
    const remainingHours = hours % 24
    const remainingMinutes = minutes % 60
    const remainingSeconds = seconds % 60

    let result = ''
    if (months > 0) result += `${months}M `
    if (remainingDays > 0) result += `${remainingDays}D `
    if (remainingHours > 0) result += `${remainingHours}H `
    if (remainingMinutes > 0) result += `${remainingMinutes}M `
    if (remainingSeconds > 0 || result === '') result += `${remainingSeconds}S` // Show seconds even if they're 0 if nothing else exists

    return result.trim()
}

export function getDateFromUTC(utcMilliseconds: number): string{
    const date = new Date(utcMilliseconds)
    return date.toLocaleString()
}

export function getDDMM(utcMilliseconds: number): {day: string, month:string}{
    const date = new Date(utcMilliseconds)
    const month = (date.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2})
    const day = (date.getDate()).toLocaleString('en-US', {minimumIntegerDigits: 2})
    return {day, month}
}

export function calculateCoffeeStats(coffeeConsumptionHistory: types.historyType): types.coffeeStatsType {
    if(!coffeeConsumptionHistory) {return {
        daily_caffeine: 0,
        daily_cost: 0,
        average_coffees: 0,
        total_cost: 0,
    }}
    const dailyStats: types.dailyStatsType= {}
    let totalCoffees = 0
    let totalCost = 0
    let totalCaffeine = 0
    let totalDaysWithCoffee = 0

    for (const [timestamp, coffee] of Object.entries(coffeeConsumptionHistory)) {
        const date = new Date(parseInt(timestamp)).toISOString().split('T')[0] // Extract date in YYYY-MM-DD format
        const caffeine = getCaffeineAmount(coffee.name)
        const cost = coffee.cost

        if (!dailyStats[date]) {
            dailyStats[date] = { caffeine: 0, cost: 0, count: 0 }
        }

        dailyStats[date].caffeine += caffeine
        dailyStats[date].cost += cost
        dailyStats[date].count += 1

        totalCoffees += 1
        totalCost += cost
    }

    const days = Object.keys(dailyStats).length;
    for (const [, stats] of Object.entries(dailyStats)) {
        if (stats.caffeine > 0) {
            totalCaffeine += stats.caffeine
            totalDaysWithCoffee += 1;
        }
    }

    const averageDailyCaffeine = totalDaysWithCoffee > 0 ? (totalCaffeine / totalDaysWithCoffee) : 0
    const averageDailyCost = totalDaysWithCoffee > 0 ? (totalCost / totalDaysWithCoffee) : 0

    return {
        daily_caffeine: averageDailyCaffeine,
        daily_cost: averageDailyCost,
        average_coffees: (totalCoffees / days),
        total_cost: totalCost,
    };
}