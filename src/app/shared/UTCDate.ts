export class MondayStartUTCDate {
    private date: Date

    constructor(year?: number, month?: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number) {
        this.date = new Date(year, month, date, hours, minutes, seconds, ms)
    }

    getDay(): number {
        const modifiedDay = this.date.getDay() - 1
        return modifiedDay > 0 ? modifiedDay : 6
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