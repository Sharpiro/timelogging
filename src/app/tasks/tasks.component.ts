import { Component, OnInit } from '@angular/core';
import { TimeloggingService } from '../shared/timelogging.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Task, TaskStatus } from '../shared/models/task';
import { ModifyTaskComponent } from '../reporting/modify-task/modify-task.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[]
  taskStatus = TaskStatus

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private timeloggingService: TimeloggingService) { }

  async ngOnInit() {

    console.log(TaskStatus[0])

    try {
      this.tasks = (await this.timeloggingService.getTasks()).sort((one, two) => { return +one.inverseMilliseconds - +two.inverseMilliseconds })
    }
    catch (error) {
      this.snackBar.open(error.message, undefined, { duration: 5000 })
      console.error(error)
    }
  }

  // onSwipeLeft(event) {
  //   console.log("swiped left...")
  //   console.log(event)
  //   alert("swiped left...")
  // }

  // onSwipeRight(event) {
  //   console.log("swiped right...")
  //   console.log(event)
  //   alert("swiped right...")
  // }

  // onDoubleTap(event) {
  //   console.log("double tap...")
  //   console.log(event)
  //   alert("double tap...")
  // }

  // onPress(event) {
  //   console.log("press...")
  //   console.log(event)
  //   alert("press...")
  // }

  editTask(task: Task) {
    if (!task) throw new Error("unable to receive task from view")
    console.log(task);

    const dialogRef = this.dialog.open(ModifyTaskComponent, {
      width: "400px",
      data: task
    })
    dialogRef.componentInstance.submitted.subscribe(async (task: Task) => {
      dialogRef.close()

      try {
        await this.timeloggingService.updateTask(task)
        this.snackBar.open(`task '${task.name}' updated successfully`, "OK", { duration: 5000 })
      }
      catch (ex) {
        this.snackBar.open(`error: ${ex.message}`, "OK", { duration: 5000 })
      }
    });
  }
}
