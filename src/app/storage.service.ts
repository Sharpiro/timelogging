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

  addLog(log: Log): Log[] {
    const logs = this.getLogs()
    logs.unshift(log)
    localStorage.setItem(this.logsKey, JSON.stringify(logs))
    return logs
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

interface ILog {
  task: string
  duration: number
  timeStamp?: Date
  logLevel?: number
}

export class Log {
  task: string
  duration: number
  timeStampUtc = new Date().toISOString()
  logLevel = 3

  constructor(init: ILog) {
    Object.assign(this, init)
  }
}
