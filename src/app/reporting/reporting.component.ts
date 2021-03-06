import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { TimeloggingService } from '../shared/timelogging.service';
import { Log } from '../shared/models/log';
import { Task } from '../shared/models/task';
import { TaskProgress } from '../shared/models/task-progress';
import { Category } from '../shared/models/category';
import { ModifyTaskComponent } from './modify-task/modify-task.component';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent implements OnInit {
  logs: Log[]
  tasks: Task[]
  categories: Category[]
  taskProgress: TaskProgress[]
  logsColumns = ['task', 'duration', 'createdDateISO']
  tasksColumns = ['name', 'weeklyGoalMinutes', 'status', 'category', 'createdDateISO']
  categoriesColumns = ['name', 'createdDateISO']
  taskProgressColumns = ['taskName', "weeklyRemaining", "weeklyCompletedMinutes", "totalCompletedMinutes", "goal", "status"]

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog, private timeloggingService: TimeloggingService) { }

  async ngOnInit() {
    try {
      this.logs = await this.timeloggingService.getLogs()
      this.tasks = await this.timeloggingService.getTasks()
      this.taskProgress = await this.timeloggingService.getWeeklyProgress(this.tasks, this.logs)
      this.categories = await this.timeloggingService.getCategories()

    } catch (error) {
      this.snackBar.open(error.message, undefined, { duration: 5000 })
      console.error(error)
    }
  }

  editTask(task: Task) {
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
