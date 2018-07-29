import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { StorageService, Log } from './storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'timelogging'
  task = "none"
  timeFormatted: string
  tasks: string[]
  logs: Log[]

  constructor(public snackBar: MatSnackBar, private storageService: StorageService) { }

  ngOnInit(): void {
    this.tasks = this.storageService.getTasks()
    this.logs = this.storageService.getLogs()
  }

  ngModelChange(event) {
    if (event != "addNew") return
    this.newTask();
  }

  submit() {
    if (!this.task || this.task == "none" || !this.timeFormatted) {
      this.snackBar.open("please fill out all fields", "OK", { duration: 5000 })
      return
    }
    let minutes = this.getMinutes(this.timeFormatted)
    if (minutes < 0) {
      this.snackBar.open("error converting time string to minutes", "OK", { duration: 5000 })
      return
    }
    console.log(this.task)
    console.log(this.timeFormatted)
    console.log(minutes)
    this.storageService.addLog({ task: this.task, time: minutes })
    this.timeFormatted = null
  }

  debug() {
    // const snackRef = this.snackBar.open("message", "action", { duration: 10000 })
    this.snackBar.open("message", "OK", { duration: 5000 })
    // snackRef.onAction().subscribe(v => {
    //   console.log("action clicked")
    // })
  }


  newTask() {
    const task = prompt("add task")
    if (!task) {
      this.task = "none"
      return
    }
    if (task === " ") {
      this.snackBar.open("invalid task name", "OK", { duration: 5000 })
    }
    this.storageService.addTask(task)
    this.tasks = this.storageService.getTasks()
    this.task = task
  }

  list() {
    const logs = this.storageService.getLogs()
    console.log(logs)
  }

  reset() {
    if (!confirm("Are you sure you want to delete all task information?")) return
    localStorage.clear()
    this.tasks = []
    this.task = "none"
    this.timeFormatted = null
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
