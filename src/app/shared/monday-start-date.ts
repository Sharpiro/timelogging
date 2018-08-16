export class MondayStartDate {
    private date: Date

    constructor()
    constructor(year: number, month: number, date: number)
    constructor(year: number, month: number, date: number, hours: number, minutes: number, seconds: number, ms: number)
    constructor(year?: number, month?: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number) {
        if (hours !== undefined) this.date = new Date(year, month, date, hours, minutes, seconds, ms)
        else if (year !== undefined) this.date = new Date(year, month, date)
        else this.date = new Date()
    }

    get dayOfTheWeek(): number {
        const day = this.date.getDay()
        const modifiedDay = day - 1
        return modifiedDay >= 0 ? modifiedDay : 6
    }

    get isoString(): string {
        return this.date.toISOString()
    }

    get weekStart(): MondayStartDate {
        const daysSinceWeekStart = this.dayOfTheWeek
        const daysSinceWeekStartMs = daysSinceWeekStart * 24 * 60 * 60 * 1000
        const adjustedDateTime = this.date.getTime()
        const weekStartDate = new Date(adjustedDateTime - daysSinceWeekStartMs)
        const weekStartUTCDate = new MondayStartDate(weekStartDate.getFullYear(), weekStartDate.getMonth(),
            weekStartDate.getDate())
        return weekStartUTCDate
    }

    get weekEnd(): MondayStartDate {
        const weekEndDayIndex = 6
        const daysUntilWeekEnd = weekEndDayIndex - this.dayOfTheWeek
        const daysUntilWeekEndMs = daysUntilWeekEnd * 24 * 60 * 60 * 1000
        const adjustedDateTime = this.date.getTime()
        const weekEndDate = new Date(adjustedDateTime + daysUntilWeekEndMs)
        const weekEndUTCDate = new MondayStartDate(weekEndDate.getFullYear(), weekEndDate.getMonth(),
            weekEndDate.getDate(), 23, 59, 59, 999)
        return weekEndUTCDate
    }

    get timeMs(): number {
        return this.date.getTime()
    }

    static fromDate(date: Date): MondayStartDate {
        return new MondayStartDate(date.getFullYear(), date.getMonth(), date.getDate(),
            date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds())
    }
}
