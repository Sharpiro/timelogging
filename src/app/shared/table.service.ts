import { Injectable } from '@angular/core';
import * as azure from '../../assets/js/azure-storage.table';
import { TableLog, Log, TableEntity } from './log';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private tableService: azure.TableService

  constructor() {
    const devCredentials = azure.generateDevelopmentStorageCredentials()
    this.tableService = azure.createTableService(devCredentials)
  }

  async tableExists(tableName: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.tableService.doesTableExist("mytable", (error, result, response) => {
        if (!error) {
          resolve(result.exists)
        }
        else {
          reject(error)
        }
      })
    })
  }

  async createTable(tableName: string): Promise<azure.TableService.TableResult> {
    return new Promise<azure.TableService.TableResult>((resolve, reject) => {
      this.tableService.createTableIfNotExists('mytable', function (error, result, response) {
        if (!error) {
          resolve(result)
        }
        else {
          reject(error)
        }
      })
    })
  }

  async insertLog(log: Readonly<Log>): Promise<void> {
    let tableEntity: TableEntity = { PartitionKey: "1", RowKey: "1" }
    let tableLog: TableLog = this.createIntersection(log, tableEntity)

    return new Promise<void>((resolve, reject) => {
      this.tableService.insertEntity('mytable', tableLog, function (error, result, response) {
        if (!error) {
          resolve()
        }
        else {
          reject(error)
        }
      })
    })
  }

  private createIntersection<T, U>(first: T, second: U): T & U {
    let result = <T & U>{};
    for (let id in first) {
      (<any>result)[id] = (<any>first)[id];
    }
    for (let id in second) {
      if (!result.hasOwnProperty(id)) {
        (<any>result)[id] = (<any>second)[id];
      }
    }
    return result;
  }
}
