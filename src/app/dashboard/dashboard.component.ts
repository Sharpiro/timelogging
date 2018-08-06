import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Log, Task } from '../shared/log';
import { TimeloggingService } from '../shared/timelogging.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title = 'timelogging'
  task: Task
  durationFormatted: string
  tasks: Task[]
  logs: Log[]

  // constructor(public snackBar: MatSnackBar, private storageService: StorageService) { }
  constructor(public snackBar: MatSnackBar, private timeLoggingService: TimeloggingService) { }

  async ngOnInit() {
    this.tasks = await this.timeLoggingService.getTasks()
    // this.logs = this.storageService.getLogs()
  }

  ngModelChange(event) {
    if (event != "addNew") return
    this.newTask();
  }

  submit() {
    if (!this.task || !this.durationFormatted) {
      this.snackBar.open("please fill out all fields", "OK", { duration: 5000 })
      return
    }
    let minutes = this.getMinutes(this.durationFormatted)
    if (minutes < 0) {
      this.snackBar.open("error converting time string to minutes", "OK", { duration: 5000 })
      return
    }
    console.log(this.task)
    console.log(this.durationFormatted)
    console.log(minutes)

    const newLog = new Log(this.task.name, minutes)
    this.timeLoggingService.insertLog(newLog)
    this.durationFormatted = null
  }

  debug() {
    // const snackRef = this.snackBar.open("message", "action", { duration: 10000 })
    this.snackBar.open("message", "OK", { duration: 5000 })
    // snackRef.onAction().subscribe(v => {
    //   console.log("action clicked")
    // })
  }


  async newTask() {
    const taskName = prompt("add task")
    if (!taskName) {
      this.task = null
      return
    }
    if (taskName === " ") {
      this.snackBar.open("invalid task name", "OK", { duration: 5000 })
    }

    try {
      const task = new Task("category1", taskName)
      await this.timeLoggingService.insertTask(task)
      this.tasks = await this.timeLoggingService.getTasks()
      this.task = task
    }
    catch (ex) {
      this.snackBar.open(ex.message, "OK", { duration: 5000 })
      console.error(ex);
    }
  }

  async list() {
    const logs = await this.timeLoggingService.getLogs()
    console.log(logs)
  }

  reset() {
    if (!confirm("Are you sure you want to delete all task information?")) return
    localStorage.clear()
    this.tasks = []
    this.logs = []
    this.task = null
    this.durationFormatted = null
  }

  getMinutes(timeFormatted: string) {
    let split = timeFormatted.split(":")
    let temp = split.length >= 2 ? +split[0] * 60 + +split[1] : +split[0]
    if (isNaN(temp)) {
      return -1
    }
    return temp
  }

}
