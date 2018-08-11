import { Component, OnInit } from '@angular/core';
import { Log, Task, TaskProgress } from '../shared/log';
import { MatSnackBar } from '@angular/material';
import { TimeloggingService } from '../shared/timelogging.service';

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
  taskProgressColumns = ['name', "remaining", "completed", "goal", "status"]

  constructor(private snackBar: MatSnackBar, private timeloggingService: TimeloggingService) { }

  async ngOnInit() {
    try {
      this.logs = await this.timeloggingService.getLogs()
      this.tasks = await this.timeloggingService.getTasks()
      this.taskProgress = await this.timeloggingService.getWeeklyProgress(this.tasks, this.logs)
      console.log(this.logs);
      console.log(this.tasks);
      console.log(this.taskProgress);
    }
    catch (error) {
      this.snackBar.open(error.message, undefined, { duration: 5000 })
      console.error(error)
    }
  }
}
