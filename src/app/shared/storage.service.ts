import { Injectable } from '@angular/core';
import { Log } from './models/log';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private logsKey = "logs"
  private tasksKey = "tasks"

  constructor() { }

  getLogs() {
    const logsJson = localStorage.getItem(this.logsKey)
    const logs: Log[] = logsJson ? JSON.parse(logsJson) : []
    return logs
  }

  insertLog(log: Log): Log[] {
    const logs = this.getLogs()
    logs.unshift(log)
    localStorage.setItem(this.logsKey, JSON.stringify(logs))
    return logs
  }

  getTasks() {
    const tasksJson = localStorage.getItem(this.tasksKey)
    const tasks: string[] = tasksJson ? JSON.parse(tasksJson) : []
    return tasks
  }

  insertTask(task: string) {
    const tasks = this.getTasks()
    tasks.push(task)
    localStorage.setItem(this.tasksKey, JSON.stringify(tasks))
  }
}
