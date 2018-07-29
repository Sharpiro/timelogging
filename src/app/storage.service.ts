import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private logsKey = "logs"
  private tasksKey = "tasks"

  constructor() { }

  getLogs() {
    let logsJson = localStorage.getItem(this.logsKey)
    let logs: Log[] = logsJson ? JSON.parse(logsJson) : []
    return logs
  }

  addLog(log: Log) {
    const logs = this.getLogs()
    logs.push(log)
    localStorage.setItem(this.logsKey, JSON.stringify(logs))
  }

  getTasks() {
    let tasksJson = localStorage.getItem(this.tasksKey)
    let tasks: string[] = tasksJson ? JSON.parse(tasksJson) : []
    return tasks
  }

  addTask(task: string) {
    const tasks = this.getTasks()
    tasks.push(task)
    localStorage.setItem(this.tasksKey, JSON.stringify(tasks))
  }
}

export interface Log {
  task: string
  time: number
}