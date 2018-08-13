import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TimeloggingService } from '../shared/timelogging.service';
import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';
import { Task } from '../shared/models/task';
import { Log } from '../shared/models/log';

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

  constructor(public snackBar: MatSnackBar, public dialog: MatDialog, private timeLoggingService: TimeloggingService) { }

  async ngOnInit() {
    this.tasks = await this.timeLoggingService.getTasks()
  }

  ngModelChange(event) {
    if (event != "addNew") return
    this.newTask()
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
    this.newTask()
  }


  async newTask() {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: "400px",
      data: {
        categories: ["cat1", "cat2", "cat3"]
      }
    })
    dialogRef.afterClosed().subscribe(async (task: Task) => {
      if (!task) return
      await this.timeLoggingService.insertTask(task)
      this.tasks = await this.timeLoggingService.getTasks()
      this.task = task
      console.log(task)
    });

    // try {

    // }
    // catch (ex) {
    //   this.snackBar.open(ex.message, "OK", { duration: 5000 })
    //   console.error(ex);
    // }
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
