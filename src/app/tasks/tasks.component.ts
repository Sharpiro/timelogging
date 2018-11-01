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
    try {
      this.tasks = (await this.timeloggingService.getTasks()).sort((one, two) => +one.inverseMilliseconds - +two.inverseMilliseconds)
    } catch (error) {
      this.snackBar.open(error.message, undefined, { duration: 5000 })
      console.error(error)
    }
  }

  editTask(task: Task) {
    if (!task) throw new Error("unable to receive task from view")
    console.log(task);

    const dialogRef = this.dialog.open(ModifyTaskComponent, {
      width: "400px",
      data: task
    })
    dialogRef.componentInstance.submitted.subscribe(async (innerTask: Task) => {
      dialogRef.close()

      try {
        await this.timeloggingService.updateTask(innerTask)
        this.snackBar.open(`task '${innerTask.name}' updated successfully`, "OK", { duration: 5000 })
      } catch (ex) {
        this.snackBar.open(`error: ${ex.message}`, "OK", { duration: 5000 })
      }
    });
  }
}
