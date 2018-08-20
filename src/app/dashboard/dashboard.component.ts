import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TimeloggingService } from '../shared/timelogging.service';
import { Task, TaskStatus } from '../shared/models/task';
import { Log } from '../shared/models/log';
import { Category } from '../shared/category';
import { TaskDialogModel } from '../shared/models/task-dialog-model';
import { AddTaskComponent } from './add-task/add-task.component';

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
  categories: Category[]

  constructor(public snackBar: MatSnackBar, private dialog: MatDialog, private timeloggingService: TimeloggingService) { }

  async ngOnInit() {
    const tasksPromise = this.timeloggingService.getTasks()
    const categoriesPromise = this.timeloggingService.getCategories()

    this.tasks = (await tasksPromise).filter(t => t.status === TaskStatus.InProgress)
    this.categories = await categoriesPromise
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

    const newLog = new Log(this.task.name, minutes)
    this.timeloggingService.insertLog(newLog)
    this.durationFormatted = null
  }

  async newTask(selection: string) {
    if (selection != "addNew") return

    const data: TaskDialogModel = {
      categories: this.categories.map(c => c.name)
    }
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: "400px",
      data: data
    })
    dialogRef.componentInstance.submitted.subscribe(async (task: Task) => {
      dialogRef.close()

      try {
        await this.timeloggingService.insertTask(task)
        this.snackBar.open(`task '${task.name}' added`, "OK", { duration: 5000 })
        this.tasks.push(task)
        this.task = task
      }
      catch (ex) {
        this.snackBar.open(`error: ${ex.message}`, "OK", { duration: 5000 })
        this.task = null
      }
    })
    dialogRef.backdropClick().subscribe(() => {
      this.task = null
    })
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
