import { Component, OnInit } from '@angular/core';
import { TableService } from '../shared/table.service';
import { Log, P, Log3 } from '../shared/log';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent implements OnInit {
  private readonly tableName = "timelogging"

  constructor(public snackBar: MatSnackBar, private tableService: TableService) { }

  async ngOnInit() {
    try {
      // const tableCreateResult = await this.tableService.createTable(this.tableName)
      // console.log(tableCreateResult)

      // const tableExistsResult = await this.tableService.tableExists(this.tableName)
      // if (!tableExistsResult) throw new Error("table does not exist!")

      // const log = new Log("task1", 5)
      const log = new Log3("task1", 12)
      console.log(log)
      // await this.tableService.insertLog(this.tableName, log)

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
