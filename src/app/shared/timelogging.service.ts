import { Injectable } from '@angular/core';
import { TableService } from './table.service';
import { nameof } from './type-functions';
import { Log } from './models/log';
import { Task, TaskStatus } from './models/task';
import { TaskProgress } from './models/task-progress';
import { MondayStartDate } from './monday-start-date';
import { Category } from './models/category';

@Injectable({
    providedIn: 'root'
})
export class TimeloggingService {
    get tasksTableName(): string {
        return this.tasksTableService.tableName
    }
    get logsTableName(): string {
        return this.logsTableService.tableName
    }
    get categoriesTableName(): string {
        return this.categoriesTableService.tableName
    }
    get tasksTableUrl(): string {
        return this.tasksTableService.tableUrl
    }
    get logsTableUrl(): string {
        return this.logsTableService.tableUrl
    }
    get categoriesTableUrl(): string {
        return this.categoriesTableService.tableUrl
    }

    constructor(private tasksTableService: TableService, private logsTableService: TableService,
        private categoriesTableService: TableService) { }

    async tasksTablesExists(): Promise<boolean> {
        const tasksTableExists = await this.tasksTableService.tableExists()
        return tasksTableExists
    }

    async logsTablesExists(): Promise<boolean> {
        const logsTableExists = await this.logsTableService.tableExists()
        return logsTableExists
    }

    async categoriesTablesExists(): Promise<boolean> {
        const logsTableExists = await this.categoriesTableService.tableExists()
        return logsTableExists
    }

    async insertLog(log: Readonly<Log>): Promise<{}> {
        return this.logsTableService.insertEntity(log)
    }

    async getLog(task: string, inverseMilliseconds: string): Promise<Log> {
        return this.logsTableService.getEntity(Log, task, inverseMilliseconds)
    }

    async getLogs(task?: string, take?: number): Promise<Log[]> {
        return this.logsTableService.getEntities(Log, task, take)
    }

    async insertTask(task: Readonly<Task>): Promise<{}> {
        return this.tasksTableService.insertEntity(task)
    }

    async updateTask(task: Readonly<Task>): Promise<void> {
        return this.tasksTableService.updateEntity(task)
    }

    async getTask(category: string, name: string): Promise<Task> {
        return this.tasksTableService.getEntity(Task, category, name)
    }

    async getTasks(category?: string, take?: number): Promise<Task[]> {
        return this.tasksTableService.getEntities(Task, category, take)
    }

    async insertCategory(category: Readonly<Category>): Promise<{}> {
        return this.categoriesTableService.insertEntity(category)
    }

    async getCategories(take?: number): Promise<Category[]> {
        return this.categoriesTableService.getEntities(Category, null, take)
    }

    getWeeklyProgress(tasks: Task[], logs: Log[]): TaskProgress[] {
        const now = new MondayStartDate()
        const weekStart = now.weekStart.timeMs
        const weekEnd = now.weekEnd.timeMs

        const logGroups = this.groupBy(nameof<Log>("task"), logs)

        const tasksProgression: TaskProgress[] = []
        const tasksMap = tasks.reduce((map, task) => {
            map[task.name] = task
            return map
        }, {})
        const logGroupsMap = logGroups.reduce((map, logGroup) => {
            map[logGroup.key] = logGroup
            return map
        }, {})

        // tslint:disable-next-line:forin
        for (const temp in tasksMap) {
            const task: Task = tasksMap[temp]
            if (!logGroupsMap[task.name] && task.status === TaskStatus.InProgress) {
                const taskProgress = new TaskProgress({
                    taskName: task.name,
                    category: task.category,
                    weeklyGoalMinutes: task.weeklyGoalMinutes,
                    weeklyCompletedMinutes: 0,
                    totalCompletedMinutes: 0,
                    status: task.status
                })
                tasksProgression.push(taskProgress)
            }
        }

        for (const grouping of logGroups) {
            const task = tasksMap[grouping.key]
            if (task.status !== TaskStatus.InProgress) continue
            if (!task) throw new Error(`could not find task '${task.name}' for given log`)
            if (!task.weeklyGoalMinutes) throw new Error("unable to calculate weeklyGoalMinutes")

            const progressReduction = grouping.value.reduce((prev, curr) => {
                const createdTimeMs = curr.created.timeMs
                const isThisWeek = createdTimeMs >= weekStart && createdTimeMs <= weekEnd
                const weeklyCompleted = isThisWeek ? prev.weeklyCompletedMinutes + curr.duration : prev.weeklyCompletedMinutes
                return {
                    totalCompletedMinutes: prev.totalCompletedMinutes + curr.duration,
                    weeklyCompletedMinutes: weeklyCompleted
                }
            }, { totalCompletedMinutes: 0, weeklyCompletedMinutes: 0 })

            const taskProgress = new TaskProgress({
                taskName: grouping.key,
                category: task.category,
                weeklyGoalMinutes: task.weeklyGoalMinutes,
                weeklyCompletedMinutes: progressReduction.weeklyCompletedMinutes,
                totalCompletedMinutes: progressReduction.totalCompletedMinutes,
                status: task.status
            })
            tasksProgression.push(taskProgress)
        }

        return tasksProgression
    }

    private groupBy<TValue>(key: string, items: TValue[]): Grouping<TValue>[] {
        const initial = items.reduce<GroupingInitial<TValue>>((groupingProgress, curr) => {
            if (!groupingProgress[curr[key]]) {
                groupingProgress[curr[key]] = []
            }
            groupingProgress[curr[key]].push(curr)

            return groupingProgress
        }, {})

        const final: Grouping<TValue>[] = []
        // tslint:disable-next-line:forin
        for (const innerKey in initial) {
            final.push({ key: innerKey, value: initial[innerKey] })
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
