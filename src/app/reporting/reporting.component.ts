import { Component, OnInit } from '@angular/core';
import { TableService } from '../table.service';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent implements OnInit {
  constructor(private tableService: TableService) { }

  async ngOnInit() {


    try {
      const tableExistsResult = await this.tableService.tableExists("mytable")
      console.log(tableExistsResult)

      // const tableCreateResult = await this.tableService.createTable("mytable")
      // console.log(tableCreateResult)

      let entity = {
        PartitionKey: 'part2',
        RowKey: 'row97',
        boolValueTrue: true,
        boolValueFalse: false,
        intValue: 42,
        dateValue: new Date(Date.UTC(2011, 10, 25)),
        complexDateValue: new Date(Date.UTC(2013, 2, 16, 1, 46, 20))
      }
      await this.tableService.insertLog(entity)
    }
    catch (error) {
      console.error(error)
    }
  }
}
