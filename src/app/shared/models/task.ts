import { DateEntity } from "./dateEntity";
import { tableKey } from "./model-helpers";

export class Task extends DateEntity {
    @tableKey("partition") readonly category: string
    @tableKey("row") readonly name: string;
    readonly inverseMilliseconds: string;
    weeklyGoalMinutes: number
    status = TaskStatus.NotStarted

    constructor();
    constructor(category: string, name: string, weeklyGoalMinutes: number, status?: TaskStatus, createdDate?: Date);
    constructor(category?: string, name?: string, weeklyGoalMinutes?: number, status?: TaskStatus, createdDate = new Date()) {
        super()
        this.category = category
        this.name = name
        this.weeklyGoalMinutes = weeklyGoalMinutes
        this.status = status
        this.inverseMilliseconds = this.toInverseMilliseconds(createdDate)
    }
}

export enum TaskStatus {
    NotStarted,
    InProgress,
    Done,
    Paused,
    Canceled
}
