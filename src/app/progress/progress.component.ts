import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TimeloggingService } from '../shared/timelogging.service';
import { TaskProgress } from '../shared/models/task-progress';
import { TaskStatus } from '../shared/models/task';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {
  taskProgressList: TaskProgress[]
  taskStatus = TaskStatus

  constructor(private snackBar: MatSnackBar, private timeloggingService: TimeloggingService) { }

  async ngOnInit() {
    try {
      const logs = await this.timeloggingService.getLogs()
      const tasks = await this.timeloggingService.getTasks()
      this.taskProgressList = await this.timeloggingService.getWeeklyProgress(tasks, logs)
    } catch (error) {
      this.snackBar.open(error.message, undefined, { duration: 5000 })
      console.error(error)
    }
  }
}
