import "reflect-metadata";

export interface TableEntity {
    PartitionKey: string
    RowKey: string
}

const tableKey = (decoratorName: "partition" | "row") => {
    return (target: Object, key: string | symbol) => {
        Reflect.defineMetadata(decoratorName, key, target)
    }
}

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

export class Category extends DateEntity {
    @tableKey("partition") readonly name: string
    @tableKey("row") readonly inverseMilliseconds: string;

    constructor();
    constructor(name: string, createdDate?: Date);
    constructor(name?: string, createdDate = new Date()) {
        super()
        this.name = name
        this.inverseMilliseconds = this.toInverseMilliseconds(createdDate)
    }
}

export class TaskProgress {
    name: string
    weeklyGoalMinutes: number
    completedMinutes: number
    status: TaskStatus

    public get remainingMinutes(): number {
        const remaining = this.weeklyGoalMinutes - this.completedMinutes
        return remaining >= 0 ? remaining : 0
    }

    constructor(taskName: string, weeklyGoalMinutes: number, completedMinutes: number, status?: TaskStatus) {
        this.name = taskName
        this.weeklyGoalMinutes = weeklyGoalMinutes
        this.completedMinutes = completedMinutes
        this.status = status
    }
}

export enum TaskStatus {
    NotStarted,
    InProgress,
    Paused,
    Done
}