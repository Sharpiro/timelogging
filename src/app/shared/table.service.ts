import * as azure from '../../assets/js/azure-storage.table';
import { nameof } from './type-functions';
import { TableEntity } from './models/model-helpers';

export class TableService {
  private tableService: azure.TableService
  private _tableName: string

  public get tableName(): string {
    return this._tableName
  }
  public get tableUrl(): string {
    return this.tableService.getUrl(this._tableName)
  }

  constructor(tableName: string, tableService: azure.TableService) {
    this._tableName = tableName
    this.tableService = tableService
  }

  async tableExists(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.tableService.doesTableExist(this.tableName, (error, result) => {
        if (!error) {
          resolve(result.exists)
        } else {
          reject(error)
        }
      })
    })
  }

  async createTable(): Promise<azure.TableService.TableResult> {
    return new Promise<azure.TableService.TableResult>((resolve, reject) => {
      this.tableService.createTableIfNotExists(this.tableName, function (error, result) {
        if (!error) {
          resolve(result)
        } else {
          reject(error)
        }
      })
    })
  }

  async insertEntity<T>(entity: Readonly<T>): Promise<{}> {
    const tableEntity = this.toTableEntity(entity)
    return new Promise<any>((resolve, reject) => {
      this.tableService.insertEntity(this.tableName, tableEntity, function (error) {
        if (!error) {
          resolve()
        } else {
          reject(error)
        }
      })
    })
  }

  async updateEntity<T>(entity: Readonly<T>): Promise<void> {
    const tableEntity = this.toTableEntity(entity)
    return new Promise<void>((resolve, reject) => {
      this.tableService.mergeEntity(this.tableName, tableEntity, function (error) {
        if (!error) {
          resolve()
        } else {
          reject(error)
        }
      })
    })
  }

  async getEntity<T>(type: new () => T, partitionKey: string, rowKey: string): Promise<T> {
    const classInstance = this
    return new Promise<T>((resolve, reject) => {
      this.tableService.retrieveEntity(this.tableName, partitionKey, rowKey, function (error, result) {
        if (!error) {
          const tableEntity = classInstance.fromTableObject(result)
          const entity = classInstance.fromTableEntity(tableEntity, type)
          resolve(entity)
        } else {
          reject(error)
        }
      })
    })
  }

  async getEntities<T>(type: new () => T, partitionKey?: string, take?: number): Promise<T[]> {
    const classInstance = this
    return new Promise<T[]>((resolve, reject) => {
      let query = new azure.TableQuery()
      if (partitionKey) {
        query = query.where('PartitionKey eq ?', partitionKey);
      }
      if (take) {
        query = query.top(take);
      }

      this.tableService.queryEntities(this.tableName, query, null, function (error, result) {
        if (!error) {
          const entities = result.entries
            .map(classInstance.fromTableObject)
            .map(te => classInstance.fromTableEntity(te, type))
          resolve(entities)
        }
        // tslint:disable-next-line:one-line
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

    const tableEntity: any = {}
    // tslint:disable-next-line:forin
    for (const id in obj) {
      const propertyDescriptor = Object.getOwnPropertyDescriptor(obj, id)
      if (!propertyDescriptor) continue

      if (id === partitionKey) {
        tableEntity[nameof<TableEntity>("PartitionKey")] = obj[id];
      } else if (id === rowKey) {
        tableEntity[nameof<TableEntity>("RowKey")] = obj[id];
      } else {
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

    for (const id in tableEntity) {
      if (id === nameof<TableEntity>("PartitionKey")) {
        instance[partitionKey] = tableEntity[id];
      } else if (id === nameof<TableEntity>("RowKey")) {
        instance[rowKey] = tableEntity[id];
      } else {
        instance[id] = tableEntity[id];
      }
    }

    if (!instance[partitionKey] || !instance[rowKey])
      throw new Error("Error converting table entity, PartitonKey and RowKey are required")

    return instance
  }

  private fromTableObject(obj: any): TableEntity {
    const newObj = {}
    // tslint:disable-next-line:forin
    for (const id in obj) {
      newObj[id] = obj[id]._;
    }
    return <any>newObj
  }
}
