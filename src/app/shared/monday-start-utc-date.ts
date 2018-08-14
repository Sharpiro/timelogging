export class MondayStartUTCDate {
    private adjustedDate: Date
    private isHistoricalDate: boolean

    constructor()
    constructor(year: number, month: number, date: number)
    constructor(year: number, month: number, date: number, hours: number, minutes: number, seconds: number, ms: number)
    constructor(year?: number, month?: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number) {
        let historicalDate: Date
        if (hours !== undefined) historicalDate = new Date(year, month, date, hours, minutes, seconds, ms)
        else if (year !== undefined) historicalDate = new Date(year, month, date)

        if (!historicalDate) {
            this.adjustedDate = new Date()
            return
        }
        this.adjustedDate = historicalDate

        // const utcOffsetMs = historicalDate.getTimezoneOffset() * 60 * 1000
        // const historicalDateMs = historicalDate.getTime()
        // this.adjustedDate = new Date(historicalDateMs - utcOffsetMs)
        // this.isHistoricalDate = true
    }

    get dayOfTheWeek(): number {
        const day = this.adjustedDate.getDay()
        const utcDay = this.adjustedDate.getUTCDay()
        const modifiedDay = day - 1
        return modifiedDay >= 0 ? modifiedDay : 6
    }

    get weekStart(): MondayStartUTCDate {
        const daysSinceWeekStart = this.dayOfTheWeek
        const daysSinceWeekStartMs = daysSinceWeekStart * 24 * 60 * 60 * 1000
        const adjustedDateTime = this.adjustedDate.getTime()
        const weekStartDate = new Date(adjustedDateTime - daysSinceWeekStartMs)
        const weekStartUTCDate = new MondayStartUTCDate(weekStartDate.getFullYear(), weekStartDate.getMonth(),
            weekStartDate.getDate())
        return weekStartUTCDate
    }

    get weekEnd(): MondayStartUTCDate {
        const weekEndDayIndex = 6
        const daysUntilWeekEnd = weekEndDayIndex - this.dayOfTheWeek
        const daysUntilWeekEndMs = daysUntilWeekEnd * 24 * 60 * 60 * 1000
        const adjustedDateTime = this.adjustedDate.getTime()
        const weekEndDate = new Date(adjustedDateTime + daysUntilWeekEndMs)
        const weekEndUTCDate = new MondayStartUTCDate(weekEndDate.getFullYear(), weekEndDate.getMonth(),
            weekEndDate.getDate(), 23, 59, 59, 999)
        return weekEndUTCDate
    }

    get isoString(): string {
        return this.adjustedDate.toISOString()
    }

    static create(): MondayStartUTCDate {
        const date = new Date()
        return new MondayStartUTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(),
            date.getSeconds(), date.getMilliseconds())
    }

    static createAdjusted(year: number, month: number, date: number): MondayStartUTCDate {
        const historicalDate = new Date(year, month, date)
        const utcOffsetMs = historicalDate.getTimezoneOffset() * 60 * 1000
        const historicalDateMs = historicalDate.getTime()
        const adjustedDate = new Date(historicalDateMs - utcOffsetMs)
        return new MondayStartUTCDate(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate())
    }

    static createUnadjusted(year: number, month: number, date: number, hours?: number, minutes?: number, seconds?: number, ms?: number): MondayStartUTCDate {
        return new MondayStartUTCDate(year, month, date, hours, minutes, seconds, ms)
    }

    // static createFromISOString(isoString: string): MondayStartUTCDate {
    //     const parsedDate = new Date(isoString)
    //     return MondayStartUTCDate.createFromDate(parsedDate)
    // }

    // private static createFromDate(date: Date): MondayStartUTCDate {
    //     return new MondayStartUTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(),
    //         date.getSeconds(), date.getMilliseconds())
    // }
}

export class MondayStartDate {
    private adjustedDate: Date

    constructor()
    constructor(year: number, month: number, date: number)
    constructor(year: number, month: number, date: number, hours: number, minutes: number, seconds: number, ms: number)
    constructor(year?: number, month?: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number) {
        if (hours !== undefined) this.adjustedDate = new Date(year, month, date, hours, minutes, seconds, ms)
        else if (year !== undefined) this.adjustedDate = new Date(year, month, date)
        else this.adjustedDate = new Date()
    }

    get dayOfTheWeek(): number {
        const day = this.adjustedDate.getDay()
        const modifiedDay = day - 1
        return modifiedDay >= 0 ? modifiedDay : 6
    }

    get isoString(): string {
        return this.adjustedDate.toISOString()
    }

    get weekStart(): MondayStartDate {
        const daysSinceWeekStart = this.dayOfTheWeek
        const daysSinceWeekStartMs = daysSinceWeekStart * 24 * 60 * 60 * 1000
        const adjustedDateTime = this.adjustedDate.getTime()
        const weekStartDate = new Date(adjustedDateTime - daysSinceWeekStartMs)
        const weekStartUTCDate = new MondayStartDate(weekStartDate.getFullYear(), weekStartDate.getMonth(),
            weekStartDate.getDate())
        return weekStartUTCDate
    }

    get weekEnd(): MondayStartDate {
        const weekEndDayIndex = 6
        const daysUntilWeekEnd = weekEndDayIndex - this.dayOfTheWeek
        const daysUntilWeekEndMs = daysUntilWeekEnd * 24 * 60 * 60 * 1000
        const adjustedDateTime = this.adjustedDate.getTime()
        const weekEndDate = new Date(adjustedDateTime + daysUntilWeekEndMs)
        const weekEndUTCDate = new MondayStartDate(weekEndDate.getFullYear(), weekEndDate.getMonth(),
            weekEndDate.getDate(), 23, 59, 59, 999)
        return weekEndUTCDate
    }
}
