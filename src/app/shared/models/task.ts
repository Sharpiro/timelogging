import { DateEntity } from "./dateEntity";
import { tableKey } from "./model-helpers";

export class Task extends DateEntity {
    @tableKey("partition") readonly category: string
    @tableKey("row") readonly name: string;
    readonly inverseMilliseconds: string;
    weeklyGoalMinutes: number
    status = TaskStatus.NotStarted

    get percentProgress(): number {
        return 0
    }

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

export function getStatuses() {
    const statuses = []
    const keys = Object.keys(TaskStatus).filter(k => typeof TaskStatus[k as any] === "number")
    for (const key of keys) {
        statuses.push({ name: key, num: TaskStatus[key] })
    }
    return statuses
}
