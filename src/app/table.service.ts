import { Injectable } from '@angular/core';
import * as azure from './js/azure-storage.table';

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

  async insertLog(entity: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.tableService.insertEntity('mytable', entity, function (error, result, response) {
        if (!error) {
          resolve()
        }
        else {
          reject(error)
        }
      })
    })
  }
}
