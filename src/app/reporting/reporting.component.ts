import { Component, OnInit } from '@angular/core';
import { Log3, TableEntity } from '../shared/log';
import { MatSnackBar } from '@angular/material';
import "reflect-metadata";
import { nameof } from '../shared/type-functions';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent implements OnInit {

  constructor(public snackBar: MatSnackBar) { }

  async ngOnInit() {
    try {
      // const tableCreateResult = await this.tableService.createTable(this.tableName)
      // console.log(tableCreateResult)

      // const tableExistsResult = await this.tableService.tableExists(this.tableName)
      // if (!tableExistsResult) throw new Error("table does not exist!")

      // const log = new Log("task1", 5)
      const originalLog = new Log3("task1", 12)
      console.log(originalLog);

      const tableEntity = this.toTableEntity(originalLog)
      console.log(tableEntity);

      const newLog = this.fromTableEntity(tableEntity, Log3)
      console.log(newLog);

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

  toTableEntity(obj: any): TableEntity {
    const partitionKey = Reflect.getMetadata("partition", obj)
    const rowKey = Reflect.getMetadata("row", obj)
    if (!partitionKey || !rowKey) throw new Error("Error, provided type does not contain 'partition' or 'row' 'tableKey' decorators")
    if (!obj[partitionKey] || !obj[rowKey]) throw new Error(`Error, property '${partitionKey}' or '${rowKey}' was not defined`)

    let tableEntity: any = {}
    for (let id in obj) {
      if (id == partitionKey) {
        tableEntity[nameof<TableEntity>("PartitionKey")] = obj[id];
      }
      else if (id == rowKey) {
        tableEntity[nameof<TableEntity>("RowKey")] = obj[id];
      }
      else {
        tableEntity[id] = obj[id];
      }
    }

    if (!tableEntity[nameof<TableEntity>("PartitionKey")] || !tableEntity[nameof<TableEntity>("RowKey")])
      throw new Error("Error converting table entity, PartitonKey and RowKey are required")

    return tableEntity
  }

  private fromTableEntity<T>(tableEntity: TableEntity, type: (new () => T)): T {
    if (!tableEntity[nameof<TableEntity>("PartitionKey")] || !tableEntity[nameof<TableEntity>("RowKey")])
      throw new Error("Error converting table entity, PartitonKey and RowKey are required")

    const instance = new type()
    const partitionKey = Reflect.getMetadata("partition", instance)
    const rowKey = Reflect.getMetadata("row", instance)
    if (!partitionKey || !rowKey) throw new Error("Error, provided type does not contain 'partition' or 'row' 'tableKey' decorators")

    for (let id in tableEntity) {
      if (id == nameof<TableEntity>("PartitionKey")) {
        instance[partitionKey] = tableEntity[id];
      }
      else if (id == nameof<TableEntity>("RowKey")) {
        instance[rowKey] = tableEntity[id];
      }
      else {
        instance[id] = tableEntity[id];
      }
    }

    if (!instance[partitionKey] || !instance[rowKey])
      throw new Error("Error converting table entity, PartitonKey and RowKey are required")

    return instance
  }
}
