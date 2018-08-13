import { DateEntity } from "./dateEntity";
import { tableKey, TaskStatus } from "./model-helpers";

export class Task extends DateEntity {
    @tableKey("partition") readonly category: string
    @tableKey("row") readonly name: string;
    readonly inverseMilliseconds: string;
    readonly status = TaskStatus.NotStarted
    readonly weeklyGoalMinutes: number

    constructor();
    constructor(category: string, name: string, weeklyGoalMinutes: number, createdDate?: Date);
    constructor(category?: string, name?: string, weeklyGoalMinutes?: number, createdDate = new Date()) {
        super()
        this.category = category
        this.name = name
        this.weeklyGoalMinutes = weeklyGoalMinutes
        this.inverseMilliseconds = this.toInverseMilliseconds(createdDate)
    }
}