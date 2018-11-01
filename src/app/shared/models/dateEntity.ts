import { MondayStartDate } from "../monday-start-date";

export abstract class DateEntity {
    abstract readonly inverseMilliseconds: string;

    public get created(): MondayStartDate {
        return this.toDate(this.inverseMilliseconds)
    }

    protected toInverseMilliseconds(date: Date): string {
        return (9999999999999 - date.getTime()).toString()
    }

    protected toDate(inverseMilliseconds: string): MondayStartDate {
        return MondayStartDate.fromDate(new Date(9999999999999 - +inverseMilliseconds))
    }
}
