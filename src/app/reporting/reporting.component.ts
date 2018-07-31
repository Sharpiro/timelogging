import { Component, OnInit } from '@angular/core';
import * as azure from '../js/azure-storage.table';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const devCredentials = azure.generateDevelopmentStorageCredentials()
    const tableService = azure.createTableService(devCredentials)
    console.log(tableService);


    tableService.doesTableExist("mytable", (error, result, response) => {
      if (!error) {
        console.log(result)
        console.log(response)
      }
      else {
        console.error(error)
      }
    })

    tableService.createTableIfNotExists('mytable', function (error, result, response) {
      if (!error) {
        var entity = {
          PartitionKey: 'part2',
          RowKey: 'row2',
          boolValueTrue: true,
          boolValueFalse: false,
          intValue: 42,
          dateValue: new Date(Date.UTC(2011, 10, 25)),
          complexDateValue: new Date(Date.UTC(2013, 2, 16, 1, 46, 20))
        }
        tableService.insertEntity('mytable', entity, function (error, result, response) {
          if (!error) {
            console.log(result)
            console.log(response)
          }
          else {
            console.error(error)
          }
        });
      }
      else {
        console.error(error)
      }
    })
  }
}
