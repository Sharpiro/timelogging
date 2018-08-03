import { Component, OnInit } from '@angular/core';
import { TableService } from '../shared/table.service';
import { Log } from '../shared/log';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent implements OnInit {
  constructor(public snackBar: MatSnackBar, private tableService: TableService) { }

  async ngOnInit() {


    try {
      const tableExistsResult = await this.tableService.tableExists("mytable")
      console.log(tableExistsResult)

      // const tableCreateResult = await this.tableService.createTable("mytable")
      // console.log(tableCreateResult)

      const log = new Log({
        task: "task1",
        duration: 25
      })
      await this.tableService.insertLog(log)
    }
    catch (error) {
      this.snackBar.open(error.message, undefined, { duration: 5000 })
      console.error(error)
    }
  }
}
