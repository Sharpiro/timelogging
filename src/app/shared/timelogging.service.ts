import { Injectable } from '@angular/core';
import { TableService } from './table.service';
import { nameof } from './type-functions';
import { Log } from './models/log';
import { Task } from './models/task';
import { TaskProgress } from './models/task-progress';
import { MondayStartUTCDate, MondayStartDate } from './monday-start-utc-date';

@Injectable({
    providedIn: 'root'
})
export class TimeloggingService {
    public get tasksTableName(): string {
        return this.tasksTableService.tableName
    }
    public get logsTableName(): string {
        return this.logsTableService.tableName
    }
    public get tasksTableUrl(): string {
        return this.tasksTableService.tableUrl
    }
    public get logsTableUrl(): string {
        return this.logsTableService.tableUrl
    }

    constructor(private tasksTableService: TableService, private logsTableService: TableService) { }

    async tasksTablesExists(): Promise<boolean> {
        const tasksTableExists = await this.tasksTableService.tableExists()
        return tasksTableExists
    }

    async logsTablesExists(): Promise<boolean> {
        const logsTableExists = await this.logsTableService.tableExists()
        return logsTableExists
    }

    async insertLog(log: Readonly<Log>): Promise<void> {
        return this.logsTableService.insertEntity(log)
    }

    async getLog(task: string, inverseMilliseconds: string): Promise<Log> {
        return this.logsTableService.getEntity(Log, task, inverseMilliseconds)
    }

    async getLogs(task?: string, take?: number): Promise<Log[]> {
        return this.logsTableService.getEntities(Log, task, take)
    }

    async insertTask(task: Readonly<Task>): Promise<void> {
        return this.tasksTableService.insertEntity(task)
    }

    async getTask(category: string, name: string): Promise<Task> {
        return this.tasksTableService.getEntity(Task, category, name)
    }

    async getTasks(category?: string, take?: number): Promise<Task[]> {
        return this.tasksTableService.getEntities(Task, category, take)
    }

    getWeeklyProgress(tasks: Task[], logs: Log[]): TaskProgress[] {
        const [start, stop] = this.getCurrentWeekRange()

        const grouping = this.groupBy(nameof<Log>("task"), logs)
        const tasksProgression = grouping.map(gOfL => {
            const task = tasks.filter(t => t.name === gOfL.key)[0]
            if (!task) throw new Error(`could not find task '${task.name}' for given log`)
            if (!task.weeklyGoalMinutes) throw new Error("unable to calculate weeklyGoalMinutes")

            const completedMinutesReduction = gOfL.value.reduce((prev, curr) => {
                return { duration: prev.duration + curr.duration }
            }, { duration: 0 })

            return new TaskProgress(gOfL.key, task.weeklyGoalMinutes, completedMinutesReduction.duration,
                task.status)
        })
        return tasksProgression
    }

    private getCurrentWeekRange(): [MondayStartDate, MondayStartDate] {
        // const date = new Date(2018, 7, 12)
        // // const date = new Date()
        // console.log(date)
        // console.log(date.getDay());
        // const now = new MondayStartUTCDate(2018, 7, 14, 15, 6, 0, 0)
        // const now = new MondayStartUTCDate(2018, 7, 14, 0, 0, 0, 0)
        // const now = new MondayStartUTCDate(2018, 7, 14, 0, 0, 0, 1)
        // const now = new MondayStartUTCDate(2018, 7, 13, 23, 59, 59, 999)
        const now = new MondayStartDate()

        console.log(now)
        console.log(now.dayOfTheWeek);
        console.log(now.isoString);
        console.log(now.weekStart.isoString);
        console.log(now.weekEnd);
        console.log(now.weekEnd.isoString);


        return [now.weekStart, now.weekEnd]
    }

    private groupBy<TValue>(key: string, items: TValue[]): Grouping<TValue>[] {
        const initial = items.reduce<GroupingInitial<TValue>>((groupingProgress, curr) => {
            if (!groupingProgress[curr[key]]) {
                groupingProgress[curr[key]] = []
            }
            groupingProgress[curr[key]].push(curr)

            return groupingProgress
        }, {})

        var final: Grouping<TValue>[] = []
        for (const key in initial) {
            final.push({ key: key, value: initial[key] })
        }
        return final
    }
}

class GroupingInitial<TValue> {
    [key: string]: TValue[]
}

export class Grouping<TValue> {
    key: string
    value: TValue[]
}