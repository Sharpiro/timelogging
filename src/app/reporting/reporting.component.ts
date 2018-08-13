import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TimeloggingService } from '../shared/timelogging.service';
import { Log } from '../shared/models/log';
import { Task } from '../shared/models/task';
import { TaskProgress } from '../shared/models/task-progress';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent implements OnInit {
  logs: Log[]
  tasks: Task[]
  taskProgress: TaskProgress[]
  logsColumns = ['task', 'duration', 'inverseMilliseconds', 'createdDateISO']
  tasksColumns = ['name', 'weeklyGoalMinutes', 'status', 'category', 'inverseMilliseconds', 'createdDateISO']
  taskProgressColumns = ['taskName', "weeklyRemaining", "weeklyCompletedMinutes", "goal", "status"]

  constructor(private snackBar: MatSnackBar, private timeloggingService: TimeloggingService) { }

  async ngOnInit() {
    try {
      this.logs = await this.timeloggingService.getLogs()
      this.tasks = await this.timeloggingService.getTasks()
      this.taskProgress = await this.timeloggingService.getWeeklyProgress(this.tasks, this.logs)
    }
    catch (error) {
      this.snackBar.open(error.message, undefined, { duration: 5000 })
      console.error(error)
    }
  }
}
