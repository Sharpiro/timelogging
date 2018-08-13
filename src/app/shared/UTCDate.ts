export class MondayStartUTCDate {
    private adjustedDate: Date

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

        const utcOffsetMs = historicalDate.getTimezoneOffset() * 60 * 1000
        const historicalDateMs = historicalDate.getTime()
        this.adjustedDate = new Date(historicalDateMs - utcOffsetMs)
    }

    getDay(): number {
        const day = this.adjustedDate.getDay()
        const modifiedDay = day - 1
        return modifiedDay >= 0 ? modifiedDay : 6
    }

    getWeekStart(): MondayStartUTCDate {
        const daysSinceWeekStart = this.getDay()
        const daysSinceWeekStartMs = daysSinceWeekStart * 24 * 60 * 60 * 1000
        const dateTime = this.adjustedDate.getTime()
        const weekStart = new Date(dateTime - daysSinceWeekStartMs)
        const weekStartUTC = new MondayStartUTCDate(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate())
        return weekStartUTC
    }

    toISOString(): string {
        return this.adjustedDate.toISOString()
    }

    static create(): MondayStartUTCDate {
        const date = new Date()
        return new MondayStartUTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(),
            date.getSeconds(), date.getMilliseconds())
    }

    static createFromISOString(isoString: string): MondayStartUTCDate {
        const parsedDate = new Date(isoString)
        return MondayStartUTCDate.createFromDate(parsedDate)
    }

    private static createFromDate(date: Date): MondayStartUTCDate {
        return new MondayStartUTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(),
            date.getSeconds(), date.getMilliseconds())
    }
}