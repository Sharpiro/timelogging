export interface TableEntity {
    PartitionKey: string
    RowKey: string
}

export class Log {
    task: string
    duration: number
    logLevel = LogLevel.Info

    constructor(init: {
        task: string
        duration: number
        logLevel?: number
    }) {
        Object.assign(this, init)
    }
}

export type TableLog = Readonly<TableEntity> & Readonly<Log>

export enum LogLevel {
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4,
    Fatal = 5
}