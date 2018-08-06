import { Component, OnInit } from '@angular/core';
import { Log, Task } from '../shared/log';
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
  constructor(private snackBar: MatSnackBar, private timeloggingService: TimeloggingService) { }

  async ngOnInit() {
    try {
      this.logs = await this.timeloggingService.getLogs()
      this.tasks = await this.timeloggingService.getTasks()
      // const tableCreateResult = await this.tableService.createTable()
      // console.log(tableCreateResult)

      // const originalLog = new Log("task1", 24)

      // const tableEntity = this.toTableEntity(originalLog)
      // console.log(tableEntity);

      // const newLog = this.fromTableEntity(tableEntity, Log)
      // console.log(newLog);

      // await this.tableService.insertLog(this.tableName, originalLog)
      // const newLog = await this.tableService.getLog(this.tableName, "task1", "2018-08-05T16:04:28.387Z")
      // const newLog = await this.tableService.getEntities(Log, undefined, 8)
      // console.log(newLog)

      // setInterval(() => {
      //   console.log("interval...");
      //   for (let i = 0; i < 100_000_000_000; i++) {

      //   }
      // }, 1_000)
    }
    catch (error) {
      this.snackBar.open(error.message, undefined, { duration: 5000 })
      console.error(error)
    }
  }
}
