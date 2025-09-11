export type coffeeType = {
    name: string
    cost: number
}

export type historyType = {
    [key: string]: coffeeType
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