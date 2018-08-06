import { Injectable } from '@angular/core';
import { Log, Task } from './log';
import { TableService } from './table.service';

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
}