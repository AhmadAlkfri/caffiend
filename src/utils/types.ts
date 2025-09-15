export type coffeeType = {
    name: string
    cost: number
}

export type historyType = {
    [time: string]: coffeeType
}

export type coffeeOption = {
    name: string
    caffeine: number
}

export type dailyStatsType = {
    [date: string]: {caffeine: number, cost: number, count: number}
}

export type coffeeCountType = {
    [coffeeName: string]: number
}

export type topThreeType = {
    coffeeName: string 
    count: number
    percentage: string
}

export type coffeeStatsType = {
    daily_caffeine: number
    daily_cost: number
    average_coffees: number
    total_cost: number
}