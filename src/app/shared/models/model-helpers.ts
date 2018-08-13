export interface TableEntity {
    PartitionKey: string
    RowKey: string
}

export const tableKey = (decoratorName: "partition" | "row") => {
    return (target: Object, key: string | symbol) => {
        Reflect.defineMetadata(decoratorName, key, target)
    }
}


export enum TaskStatus {
    NotStarted,
    InProgress,
    Paused,
    Done
}