export abstract class DateEntity {
    abstract readonly inverseMilliseconds: string;

    public get created(): Date {
        return this.toDate(this.inverseMilliseconds)
    }

    protected toInverseMilliseconds(date: Date): string {
        return (9999999999999 - date.getTime()).toString()
    }

    protected toDate(inverseMilliseconds: string): Date {
        return new Date(9999999999999 - +inverseMilliseconds)
    }
}