import "reflect-metadata";
import { tableKey } from "./model-helpers";
import { DateEntity } from "./dateEntity";

export class Log extends DateEntity {
    @tableKey("partition") readonly task: string
    @tableKey("row") readonly inverseMilliseconds: string;
    readonly duration: number;

    constructor();
    constructor(task: string, duration: number, createdDate?: Date);
    constructor(task?: string, duration?: number, createdDate = new Date()) {
        super()
        this.task = task
        this.duration = duration
        this.inverseMilliseconds = this.toInverseMilliseconds(createdDate)
    }
}
