import { Injectable } from '@angular/core';
import * as azure from '../../assets/js/azure-storage.table';
import { Log, TableEntity } from './log';
import { nameof } from './type-functions';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private tableService: azure.TableService
  private _tableName: string

  public get tableName(): string {
    return this._tableName
  }
  public get url(): string {
    return this.tableService.getUrl(this._tableName)
  }

  constructor(tableName: string, tableService: azure.TableService) {
    this._tableName = tableName
    this.tableService = tableService
  }

  async tableExists(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.tableService.doesTableExist(this.tableName, (error, result, response) => {
        if (!error) {
          resolve(result.exists)
        }
        else {
          reject(error)
        }
      })
    })
  }

  async createTable(): Promise<azure.TableService.TableResult> {
    return new Promise<azure.TableService.TableResult>((resolve, reject) => {
      this.tableService.createTableIfNotExists(this.tableName, function (error, result, response) {
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
    const tableEntityLog = this.toTableEntity(log)
    return new Promise<void>((resolve, reject) => {
      this.tableService.insertEntity(this.tableName, tableEntityLog, function (error, result, response) {
        if (!error) {
          resolve()
        }
        else {
          reject(error)
        }
      })
    })
  }

  async getLog(partitionKey: string, rowKey: string): Promise<Log> {
    const classInstance = this
    return new Promise<Log>((resolve, reject) => {
      this.tableService.retrieveEntity(this.tableName, partitionKey, rowKey, function (error, result, response) {
        if (!error) {
          const tableEntity = classInstance.fromTableObject(result)
          const log = classInstance.fromTableEntity(tableEntity, Log)
          resolve(log)
        }
        else {
          reject(error)
        }
      })
    })
  }

  async getLogs(partitionKey?: string, take?: number): Promise<Log[]> {
    const classInstance = this
    return new Promise<any[]>((resolve, reject) => {
      let query = new azure.TableQuery()
      if (partitionKey) {
        query = query.where('PartitionKey eq ?', partitionKey);
      }
      if (take) {
        query = query.top(take);
      }

      this.tableService.queryEntities(this.tableName, query, null, function (error, result, response) {
        if (!error) {
          const logs = result.entries
            .map(classInstance.fromTableObject)
            .map(te => classInstance.fromTableEntity(te, Log))
          resolve(logs)
        }
        else {
          reject(error)
        }
      });
    })
  }

  private toTableEntity(obj: any): TableEntity {
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

  private fromTableObject(obj: any): TableEntity {
    let newObj = {}
    for (let id in obj) {
      newObj[id] = obj[id]._;
    }
    return <any>newObj
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
