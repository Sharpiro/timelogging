import "reflect-metadata";

export interface TableEntity {
    PartitionKey: string
    RowKey: string
}

const tableKey = (decoratorName: "partition" | "row") => {
    return (target: Object, key: string | symbol) => {
        Reflect.defineMetadata(decoratorName, key, target)
    }
}

export class Log {
    @tableKey("partition") task: string
    @tableKey("row") createdDateISO: string;
    duration: number;

    constructor();
    constructor(task: string, duration: number, createdDateISO?: string);
    constructor(task?: string, duration?: number, createdDateISO = new Date().toISOString()) {
        this.task = task
        this.duration = duration
        this.createdDateISO = createdDateISO
    }
}
