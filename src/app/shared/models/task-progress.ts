import { TaskStatus } from "./task";

export class TaskProgress {
    taskName: string
    category: string
    weeklyGoalMinutes: number
    weeklyCompletedMinutes: number
    totalCompletedMinutes: number
    status: TaskStatus

    get remainingWeeklyMinutes(): number {
        if (this.status === TaskStatus.Done || this.status === TaskStatus.Paused) return 0
        const remaining = this.weeklyGoalMinutes - this.weeklyCompletedMinutes
        return remaining >= 0 ? remaining : 0
    }

    get weeklyCompletionPercent(): number {
        if (this.status === TaskStatus.Done || this.status === TaskStatus.Paused) return 0
        const percentComplete = this.weeklyCompletedMinutes / this.weeklyGoalMinutes * 100
        return percentComplete
    }

    constructor(data: Partial<TaskProgress>) {
        Object.assign(this, data)
    }
}