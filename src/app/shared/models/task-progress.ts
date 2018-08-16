import { TaskStatus } from "./task";

export class TaskProgress {
    taskName: string
    weeklyGoalMinutes: number
    weeklyCompletedMinutes: number
    totalCompletedMinutes: number
    status: TaskStatus

    get remainingWeeklyMinutes(): number {
        if (this.status === TaskStatus.Done || this.status === TaskStatus.Paused) return 0
        const remaining = this.weeklyGoalMinutes - this.weeklyCompletedMinutes
        return remaining >= 0 ? remaining : 0
    }

    constructor(taskName: string, weeklyGoalMinutes: number, weeklyCompletedMinutes: number, totalCompletedMinutes: number,
        status?: TaskStatus) {
        this.taskName = taskName
        this.weeklyGoalMinutes = weeklyGoalMinutes
        this.weeklyCompletedMinutes = weeklyCompletedMinutes
        this.totalCompletedMinutes = totalCompletedMinutes
        this.status = status
    }
}